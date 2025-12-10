// order.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    product_details: {
      type: Object,
      required: true,
    },
  },
  { _id: false } // keep subdocs without their own _id
);

const orderSchema = new mongoose.Schema(
  {
    // human-friendly order id (unique)
    orderId: { type: String, required: true, unique: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // items array - multiple products in a single order
    items: {
      type: [orderItemSchema],
      default: [],
      required: true,
    },

    delivery_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },

    orderStatus: {
      type: String,
      default: "Processing",
    },

    payment_status: {
      type: String,
      default: "COD Pending",
    },

    paymentId: { type: String, default: "" },
    invoice_receipt: { type: String, default: "" },

    subTotalAmt: { type: Number, default: 0 },
    totalAmt: { type: Number, default: 0 },

    delivery_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveryStatus: {
      type: String,
      enum: [
        "Pending", // when assigned but driver hasn't acted yet
        "Accepted",
        "Rejected",
        "OnTheWayToPickup",
        "ArrivedAtPickup",
        "PickedUp",
        "OnTheWayToCustomer",
        "ArrivedAtCustomer",
        "DeliveredSuccessfully",
        "FailedDelivery",
        "ReturnToSeller",
      ],
      default: "Pending",
    },


    delivery_person_name: { type: String, default: "" },

    assignedAt: { type: Date, default: null },
    expectedDeliveryDate: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
