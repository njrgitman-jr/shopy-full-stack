import OrderModel from "../models/order.model.js";
import User from "../models/user.model.js";

// ======================================================
// 🚚 1. Get Orders Assigned to Delivery Person
// ======================================================
export const getAssignedOrdersController = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    console.log("BACKEND userId:", userId);

    // ensure valid user
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    // fetch assigned orders
    const orders = await OrderModel.find({ delivery_person: userId })
      .populate("userId", "email name")
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// ======================================================
// 🚚 2. Update deliveryStatus
// ======================================================
export const updateDeliveryStatusController = async (req, res) => {
  try {
    const { orderId, deliveryStatus } = req.body;
    const userId = req.userId;

    if (!orderId || !deliveryStatus) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const order = await OrderModel.findOne({ orderId });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (String(order.delivery_person) !== String(userId)) {
      return res.json({ success: false, message: "Not authorized" });
    }

    order.deliveryStatus = deliveryStatus;

    if (deliveryStatus === "DeliveredSuccessfully") {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.json({ success: true, message: "Delivery status updated" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
