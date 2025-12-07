import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import CartHistoryModel from "../models/carthistory.model.js"; 
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * Create a single Order for all cart items (Cash On Delivery)
 * Steps:
 * 1. Read the authenticated userId and (optional) totals/address from request body.
 * 2. Load all cart items for the user (populate product information).
 * 3. Validate - if no items -> return error.
 * 4. Start a mongoose transaction (if available) for atomicity.
 * 5. Create a single Order document containing an items[] array (one entry per cart item).
 * 6. Insert all cart items into CartHistory with orderId = created order._id.
 * 7. Remove cart items and clear user's shopping_cart.
 * 8. Commit transaction and return the created order.
 */
export async function CashOnDeliveryOrderController(request, response) {
  const session = await mongoose.startSession();
  try {
    const userId = request.userId; // set by auth middleware
    const { totalAmt: bodyTotalAmt, addressId, subTotalAmt: bodySubTotal } = request.body;

    // 1) FETCH ALL CART ITEMS FOR THE USER (and populate product data)
    const cartItems = await CartProductModel.find({ userId }).populate("productId");
    if (!cartItems || cartItems.length === 0) {
      return response.status(400).json({
        message: "Cart is empty. Nothing to order.",
        error: true,
        success: false,
      });
    }

    // 2) CALCULATE SUBTOTAL / TOTAL (use body values if provided else compute from cart)
    let computedSubTotal = 0;
    const items = cartItems.map((cart) => {
      const product = cart.productId || {}; // populated product document
      // price fallback: product.price || 0
      // NOTE: if you have discounts / price-with-discount functions, replace below calculation accordingly
      const unitPrice = Number(product.price ?? 0);
      const quantity = Number(cart.quantity ?? 1);
      const lineSubtotal = unitPrice * quantity;
      computedSubTotal += lineSubtotal;

      return {
        productId: product._id,
        quantity,
        product_details: {
          name: product.name ?? "",
          image: product.image ?? [],
          price: unitPrice,
          discount: product.discount ?? 0,
        },
      };
    });

    const subTotalAmt = typeof bodySubTotal !== "undefined" ? Number(bodySubTotal) : computedSubTotal;
    const totalAmt = typeof bodyTotalAmt !== "undefined" ? Number(bodyTotalAmt) : subTotalAmt; // adjust if taxes/shipping applied

    // 3) Create a unique human-readable orderId string
    const humanOrderId = `ORD-${new mongoose.Types.ObjectId()}`;

    // 4) START TRANSACTION to ensure atomic moves (if DB supports transactions)
    session.startTransaction();
    try {
      // 5) Create a single Order document with items array
      const orderDoc = {
        orderId: humanOrderId,
        userId,
        items, // <-- array of items (productId + quantity + product_details)
        paymentId: "",
        payment_status: "COD Pending",
        delivery_address: addressId,
        subTotalAmt,
        totalAmt,
      };

      const createdOrder = await OrderModel.create([orderDoc], { session });
      // createdOrder is an array (create with array returns array), grab first doc
      const order = createdOrder[0];

      // 6) Prepare CartHistory entries: give each cart item the created order._id
      const historyPayload = cartItems.map((cart) => ({
        orderId: order._id, // reference to the single order doc
        productId: cart.productId._id,
        quantity: cart.quantity,
        userId,
      }));

      if (historyPayload.length > 0) {
        await CartHistoryModel.insertMany(historyPayload, { session });
      }

      // 7) Remove all cart products for the user
      await CartProductModel.deleteMany({ userId }, { session });

      // 8) Clear user's shopping_cart array in UserModel
      await UserModel.updateOne({ _id: userId }, { shopping_cart: [] }, { session });

      // 9) Commit transaction
      await session.commitTransaction();
      session.endSession();

      // Return the created order (populated minimal info)
      const orderToReturn = await OrderModel.findById(order._id).populate("delivery_address");

      return response.json({
        message: "Order created successfully",
        error: false,
        success: true,
        data: orderToReturn,
      });
    } catch (txError) {
      // Abort transaction on any error inside transaction block
      await session.abortTransaction();
      session.endSession();
      throw txError;
    }
  } catch (error) {
    // Ensure session is ended if outer try fails before committing
    try {
      await session.endSession();
    } catch (e) {
      /* ignore */
    }
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

export async function paymentController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const user = await UserModel.findById(userId);

    const line_items = list_items.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount: Math.round(
            pricewithDiscount(item.productId.price, item.productId.discount) *
              100
          ),
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return response.status(200).json(session);
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const paylod = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      };

      productList.push(paylod);
    }
  }

  return productList;
};

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
  const event = request.body;
  const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

  console.log("event", event);

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      const userId = session.metadata.userId;
      const orderProduct = await getOrderProductItems({
        lineItems: lineItems,
        userId: userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });

      const order = await OrderModel.insertMany(orderProduct);

      console.log(order);
      if (Boolean(order[0])) {
        const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
          shopping_cart: [],
        });
        const removeCartProductDB = await CartProductModel.deleteMany({
          userId: userId,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}

export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId; // order id

    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

