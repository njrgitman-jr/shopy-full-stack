// server/controllers/adminOrder.controller.js
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

/**
 * GET /api/order/admin-list
 * Returns all orders (populated)
 */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .populate("delivery_address")
      .populate("productId", "name")
      .exec();

    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("getAllOrdersAdmin error:", error);
    return res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

/**
 * GET /api/order/delivery-persons
 * Returns all users with role "DELV"
 */
export const getDeliveryPersonsForAssign = async (req, res) => {
  try {
    const deliveryPersons = await UserModel.find({ role: "DELV" }).select("name _id");
    return res.json({ success: true, data: deliveryPersons });
  } catch (error) {
    console.error("getDeliveryPersonsForAssign error:", error);
    return res.status(500).json({ success: false, message: "Error fetching delivery persons", error: error.message });
  }
};

/**
 * PUT /api/order/assign-delivery/:orderId
 * body: { deliveryPersonId, deliveryPersonName }
 */
export const assignDeliveryPersonToOrder = async (req, res) => {
  const { orderId } = req.params;
  const { deliveryPersonId, deliveryPersonName } = req.body;

  if (!deliveryPersonId) {
    return res.status(400).json({ success: false, message: "deliveryPersonId is required" });
  }

  try {
    const update = {
      delivery_person: deliveryPersonId,
      delivery_person_name: deliveryPersonName || "",
      assignedAt: new Date(),
    };

    const order = await OrderModel.findOneAndUpdate({ orderId }, update, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error("assignDeliveryPersonToOrder error:", error);
    return res.status(500).json({ success: false, message: "Error assigning delivery", error: error.message });
  }
};

/**
 * PUT /api/order/update-status/:orderId
 * body: { status }
 */
export const updateOrderStatusAdmin = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "status is required" });
  }

  try {
    const update = { orderStatus: status };
    if (status === "Delivered") update.deliveredAt = new Date();

    const order = await OrderModel.findOneAndUpdate({ orderId }, update, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error("updateOrderStatusAdmin error:", error);
    return res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};
