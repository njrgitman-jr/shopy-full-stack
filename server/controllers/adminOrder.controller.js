import OrderModel from "../models/order.model.js";

// Controller to get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate('userId', 'name')
      .populate('delivery_address', 'address')
      .populate('productId', 'name')
      .exec();

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Controller to update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await OrderModel.findOneAndUpdate(
      { orderId: orderId },
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order", error: error.message });
  }
};
