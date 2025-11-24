import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";

export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name")
      .populate("delivery_address")
      .lean();

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const adminUpdateOrder = async (req, res) => {
  try {
    const { orderId, field, value } = req.body;

    const updated = await OrderModel.findOneAndUpdate(
      { orderId },
      { [field]: value },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Update failed" });
  }
};
