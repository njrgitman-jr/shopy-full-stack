// server/controllers/adminOrder.controller.js
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

/**
 * GET /api/admin/order/get
 * Admin only. Returns list of orders with populated references and summary fields.
 */
// server/controllers/adminOrder.controller.js
export const getOrdersAdmin = async (req, res) => {
  try {
    let { status, from, to, search, page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const filter = {};

    if (status) filter.orderStatus = status;
    if (from || to) filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);

    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "product_details.name": { $regex: search, $options: "i" } },
      ];
    }

    const totalCount = await OrderModel.countDocuments(filter);

    const orders = await OrderModel.find(filter)
      .populate({ path: "userId", select: "name email" })
      .populate({ path: "delivery_person", select: "name email mobile" })
      .populate({ path: "delivery_address" })
      .populate({ path: "productId", select: "name" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      message: "Orders fetched",
      data: orders,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("getOrdersAdmin error:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Failed to fetch orders",
    });
  }
};


/**
 * PUT /api/admin/order/assign
 * Body: { orderId, delivery_person: userId }
 * Admin only. Assign a delivery person to an order.
 */
export const assignDeliveryPerson = async (req, res) => {
  try {
    const { orderId, delivery_person } = req.body;

    if (!orderId || !delivery_person) {
      return res.status(400).json({
        success: false,
        message: "orderId and delivery_person are required",
      });
    }

    // verify delivery person role
    const deliveryUser = await UserModel.findById(delivery_person);
    if (!deliveryUser || deliveryUser.role !== "DELV") {
      return res.status(400).json({
        success: false,
        message: "Provided user is not a delivery person",
      });
    }

    const updated = await OrderModel.findOneAndUpdate(
      { orderId },
      {
        delivery_person,
        delivery_person_name: deliveryUser.name || "",
        assignedAt: new Date(),
        // optionally change status to Processing/ReadyForDispatch if desired:
        // orderStatus: "Processing",
      },
      { new: true }
    )
      .populate({ path: "delivery_person", select: "name email mobile" })
      .lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      data: updated,
      message: "Delivery person assigned",
    });
  } catch (error) {
    console.error("assignDeliveryPerson error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign delivery person",
    });
  }
};

/**
 * PUT /api/admin/order/update-status
 * Body: { orderId, orderStatus }
 * Admin only. Update order workflow status.
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    if (!orderId || !orderStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Missing params" });
    }

    const updated = await OrderModel.findOneAndUpdate(
      { orderId },
      {
        orderStatus,
        ...(orderStatus === "Delivered" ? { deliveredAt: new Date() } : {}),
      },
      { new: true }
    )
      .populate({ path: "delivery_person", select: "name email" })
      .lean();

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    return res.json({
      success: true,
      data: updated,
      message: "Status updated",
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update status" });
  }
};

/**
 * GET /api/admin/order/get/:orderId
 * Admin only. Return single order by orderId (useful for view products).
 */
export const getOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findOne({ orderId })
      .populate({ path: "userId", select: "name email" })
      .populate({ path: "delivery_person", select: "name email" })
      .populate({ path: "delivery_address" })
      .populate({ path: "productId", select: "name" })
      .lean();

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error("getOrderByOrderId error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get order" });
  }
};
