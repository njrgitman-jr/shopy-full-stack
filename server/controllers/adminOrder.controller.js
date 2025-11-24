// server/controllers/adminorder.controller.js
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

/**
 * GET /api/admin/orders
 * Query params: page (default 1), limit (default 10), q or filter optional
 * Admin only (protect with auth + admin middleware in route)
 */
export const listOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
    const skip = (page - 1) * limit;

    // Basic filter extension if needed in future
    const filter = {};

    // Count and fetch with population
    const total = await OrderModel.countDocuments(filter);
    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .populate("delivery_person", "name email mobile role")
      .populate("delivery_address") // if you have address model
      .lean();

    return res.json({
      success: true,
      data: {
        total,
        page,
        limit,
        orders,
      },
    });
  } catch (err) {
    console.error("listOrders:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * PUT /api/admin/orders/:id
 * Body may contain: payment_status, orderStatus, delivery_person
 * When delivery_person is set we also set assignedAt and delivery_person_name
 */
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, orderStatus, delivery_person } = req.body;

    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // If updating delivery_person, validate the user exists and is DELV
    if (delivery_person) {
      const user = await UserModel.findById(delivery_person);
      if (!user) {
        return res.status(400).json({ success: false, message: "Delivery person not found" });
      }
      if (user.role !== "DELV") {
        return res.status(400).json({ success: false, message: "Selected user is not a delivery person" });
      }
      order.delivery_person = user._id;
      order.delivery_person_name = user.name || "";
      order.assignedAt = new Date();
    } else if (delivery_person === null || delivery_person === "") {
      // unassign
      order.delivery_person = null;
      order.delivery_person_name = "";
      order.assignedAt = null;
    }

    if (payment_status) order.payment_status = payment_status;
    if (orderStatus) order.orderStatus = orderStatus;

    await order.save();

    // return updated order with populated fields
    const updated = await OrderModel.findById(order._id)
      .populate("userId", "name email")
      .populate("delivery_person", "name email mobile");

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateOrder:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
