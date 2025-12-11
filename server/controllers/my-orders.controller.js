import OrderModel from "../models/order.model.js";

export const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId })
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
