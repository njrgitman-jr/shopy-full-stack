import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import OrderModel from "../models/order.model.js";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import mongoose from "mongoose";

export const getAdminDashboardStats = async (req, res) => {
  try {
    // TOTAL COUNTERS
    const totalUsers = await UserModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();
    const totalOrders = await OrderModel.countDocuments();
    const totalCategories = await CategoryModel.countDocuments();
    const totalSubcategories = await SubCategoryModel.countDocuments();

    // ORDER STATUS CHART (Bar/Pie chart)
    const orderStatusChart = await OrderModel.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    // MONTHLY REVENUE CHART
    const monthlyRevenue = await OrderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmt" },
        },
      },
      { $sort: { "_id": 1 } }
    ]);

    // RECENT ORDERS (Table)
    const recentOrders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    return res.json({
      success: true,
      message: "Admin Dashboard Overview Loaded",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalSubcategories,
        orderStatusChart,
        monthlyRevenue,
        recentOrders,
      }
    });

  } catch (error) {
    console.log("Dashboard Error →", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Failed to load dashboard stats"
    });
  }
};
