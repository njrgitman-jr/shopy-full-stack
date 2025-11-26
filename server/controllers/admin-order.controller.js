// server/controllers/admin-order.controller.js
import OrderModel from "../models/order.model.js";

import User from "../models/user.model.js";

/**
 * List orders with pagination, search and status filter
 * Query params:
 *  - page (default 1)
 *  - limit (default 10)
 *  - search (orderId or user's email)
 *  - status (orderStatus)
 */
export const adminOrderListController = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
    const search = (req.query.search || "").trim();
    const status = req.query.status || "";

    // --- Base match filter ---
    const match = {};

    if (status) match.orderStatus = status;

    if (search) {
      match.$or = [
        { orderId: { $regex: search, $options: "i" } },
      ];
    }

    // -------------------------
    // COUNT PIPELINE (NO LOOKUP)
    // -------------------------
    const total = await OrderModel.countDocuments(match);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // -------------------------
    // DATA PIPELINE (WITH LOOKUP)
    // -------------------------
    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { orderId: { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          __v: 0,
          "user.password": 0,
          "user.refresh_token": 0,
        },
      }
    );

    const orders = await OrderModel.aggregate(pipeline);

    const populated = await OrderModel.populate(orders, [
      { path: "productId", select: "name" },
      { path: "delivery_person", select: "name email mobile role" },
    ]);

    return res.json({
      success: true,
      data: populated,
      pagination: { total, page, pages, limit },
    });

  } catch (error) {
    console.error("adminOrderListController error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


/**
 * Update order status (admin)
 * Body: { orderId: "<orderId>", status: "Processing" }
 */
export const adminUpdateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "orderId and status are required" });
    }

    const order = await OrderModel.findOne({ orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = status;

    // automatic timestamp handling for Delivered
    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    console.error("adminUpdateOrderStatusController error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Assign delivery person
 * Body: { orderId: "<orderId>", deliveryPersonId: "<userId>" }
 */
export const adminAssignDeliveryController = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;
    if (!orderId || !deliveryPersonId) {
      return res.status(400).json({ success: false, message: "orderId and deliveryPersonId required" });
    }

   const [order, deliveryUser] = await Promise.all([
  OrderModel.findOne({ orderId }),
  User.findById(deliveryPersonId),
]);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!deliveryUser) return res.status(404).json({ success: false, message: "Delivery user not found" });
    if (deliveryUser.role !== "DELV") {
      return res.status(400).json({ success: false, message: "Selected user is not a delivery person" });
    }

    order.delivery_person = deliveryUser._id;
    order.delivery_person_name = deliveryUser.name || "";
    order.assignedAt = new Date();

    await order.save();

    return res.json({ success: true, message: "Delivery person assigned", data: order });
  } catch (error) {
    console.error("adminAssignDeliveryController error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get list of delivery persons (role = DELV)
 */
export const adminGetDeliveryPersonsController = async (req, res) => {
  try {
    const deliveryPersons = await User.find({ role: "DELV" }).select("name email mobile");
    return res.json({ success: true, data: deliveryPersons });
  } catch (error) {
    console.error("adminGetDeliveryPersonsController error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
