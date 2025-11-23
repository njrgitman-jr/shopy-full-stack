// server/controllers/adminOrder.controller.js
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

/**
 * GET /api/admin/order/get
 * supports: ?page=1&limit=10&status=Delivered&from=YYYY-MM-DD&to=YYYY-MM-DD&search=...
 */
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
  } catch (err) {
    console.error("getOrdersAdmin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const assignDeliveryPerson = async (req, res) => {
  try {
    const { orderId, delivery_person } = req.body;
    if (!orderId || !delivery_person) {
      return res.status(400).json({ success: false, message: "Missing params" });
    }
    const deliveryUser = await UserModel.findById(delivery_person);
    if (!deliveryUser || deliveryUser.role !== "DELV") {
      return res.status(400).json({ success: false, message: "Invalid delivery person" });
    }
    const updated = await OrderModel.findOneAndUpdate(
      { orderId },
      { delivery_person, delivery_person_name: deliveryUser.name || "", assignedAt: new Date() },
      { new: true }
    )
      .populate({ path: "delivery_person", select: "name email mobile" })
      .lean();

    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, message: "Assigned", data: updated });
  } catch (err) {
    console.error("assignDeliveryPerson error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    if (!orderId || !orderStatus) return res.status(400).json({ success: false, message: "Missing params" });

    const updateFields = { orderStatus };
    if (orderStatus === "Delivered") updateFields.deliveredAt = new Date();

    const updated = await OrderModel.findOneAndUpdate({ orderId }, updateFields, { new: true })
      .populate({ path: "delivery_person", select: "name email" })
      .lean();

    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, message: "Status updated", data: updated });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findOne({ orderId })
      .populate({ path: "userId", select: "name email" })
      .populate({ path: "delivery_person", select: "name email" })
      .populate({ path: "delivery_address" })
      .populate({ path: "productId", select: "name" })
      .lean();

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, data: order });
  } catch (err) {
    console.error("getOrderByOrderId error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
