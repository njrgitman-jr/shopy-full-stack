// server/controllers/adminOrder.controller.js
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

// ===========================
// ⭐ ADMIN: GET ALL ORDERS
// ===========================
export const adminGetAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .populate("productId", "name")
      .populate("delivery_address")
      .populate("delivery_person", "name email");

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// ===========================
// ⭐ ADMIN: UPDATE ORDER STATUS
// ===========================
export const adminUpdateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await OrderModel.updateOne(
      { _id: orderId },
      { orderStatus: status, updatedAt: new Date() }
    );

    return res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// ===========================
// ⭐ ADMIN: ASSIGN DELIVERY PERSON
// ===========================
export const adminAssignDeliveryPersonController = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;

    const person = await UserModel.findById(deliveryPersonId);

    await OrderModel.updateOne(
      { _id: orderId },
      {
        delivery_person: person._id,
        delivery_person_name: person.name,
        assignedAt: new Date(),
      }
    );

    return res.json({
      success: true,
      message: "Delivery person assigned",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
