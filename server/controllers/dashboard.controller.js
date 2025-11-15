import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import OrderModel from "../models/order.model.js";

export const dashboardOverview = async (request, response) => {
  console.log("✅ Dashboard Controller Called");

  try {
    // 1️⃣ Basic stats
    const totalUsers = await UserModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();
    const totalOrders = await OrderModel.countDocuments();

    // 2️⃣ Top selling products (group by productId)
    const topSellingProducts = await OrderModel.aggregate([
      {
        $group: {
          _id: "$productId",
          totalSales: { $sum: 1 },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $project: {
          _id: 1,
          totalSales: 1,
          "productDetails.name": 1,
          "productDetails.stock": 1,
          "categoryDetails.name": 1,
        },
      },
    ]);

    // 3️⃣ Recent Orders
    const recentOrders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("productId", "name image category")
      .populate("userId", "name");

    // 4️⃣ Recent Users
    const recentUsers = await UserModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name avatar orderHistory");

    console.log("📊 totalUsers:", totalUsers, "totalProducts:", totalProducts, "totalOrders:", totalOrders);
    console.log("🏆 topSellingProducts:", topSellingProducts.length);
    console.log("🛒 recentOrders:", recentOrders.length);
    console.log("👥 recentUsers:", recentUsers.length);

    response.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        topSellingProducts,
        recentOrders,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard Error:", error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
