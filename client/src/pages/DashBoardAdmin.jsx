import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const DashBoardAdmin = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalUsersChange: 0,
    totalProducts: 0,
    totalProductsChange: 0,
    totalSales: 0,
    totalSalesChange: 0,
    totalOrders: 0,
    totalOrdersChange: 0,
    revenueGrowth: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    salesOverTime: [],
    categoryBreakdown: [],
    topProducts: [],
    slowMovers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await Axios({ ...SummaryApi.dashboardOverview });
        setData(response.data.data || {});
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return <div className="p-4 text-center">Loading dashboard...</div>;

  const renderChange = (value) => {
    if (!value) return null;
    const isUp = value >= 0;
    return (
      <span
        className={`ml-2 text-sm font-semibold ${
          isUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {isUp ? "▲" : "▼"} {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">📊 Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Total Users",
            value: data.totalUsers || 0,
            change: data.totalUsersChange,
          },
          {
            title: "Total Products",
            value: data.totalProducts || 0,
            change: data.totalProductsChange,
          },
          {
            title: "Total Sales",
            value: `${data.totalSales || 0} JD`,
            change: data.totalSalesChange,
          },
          {
            title: "Orders",
            value: data.totalOrders || 0,
            change: data.totalOrdersChange,
          },
          {
            title: "Revenue Growth",
            value: `${data.revenueGrowth || 0}%`,
            change: data.revenueGrowth,
          },
          {
            title: "Avg Order Value",
            value: `${data.avgOrderValue || 0} JD`,
            change: 0,
          },
          {
            title: "Conversion Rate",
            value: `${data.conversionRate || 0}%`,
            change: 0,
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow"
          >
            <h4 className="text-gray-500 mb-2 flex items-center">
              {kpi.title} {renderChange(kpi.change)}
            </h4>
            <span className="text-2xl font-bold text-gray-800">
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Sales Over Time */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">📈 Sales Over Time</h3>
        <div className="w-full h-64 flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">📊 Category Breakdown</h3>
        <div className="w-full h-64 flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>

      {/* Top Products / Slow Movers Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">
          🏆 Top Products / Slow Movers
        </h3>

        {/* Top Products Table */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-2">Top Selling Products</h4>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {(data.topProducts || []).map((item, idx) => (
                <tr
                  key={idx}
                  className="text-gray-700 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{item.name || "-"}</td>
                  <td className="px-4 py-2 border">{item.category || "-"}</td>
                  <td className="px-4 py-2 border">{item.unitsSold || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Slow Movers Table */}
        <div>
          <h4 className="text-md font-semibold mb-2">Slow Moving Products</h4>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {(data.slowMovers || []).map((item, idx) => (
                <tr
                  key={idx}
                  className="text-gray-700 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{item.name || "-"}</td>
                  <td className="px-4 py-2 border">{item.category || "-"}</td>
                  <td className="px-4 py-2 border">{item.unitsSold || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashBoardAdmin;
