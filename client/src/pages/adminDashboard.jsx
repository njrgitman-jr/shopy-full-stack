import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await Axios(SummaryApi.adminDashboard);
      if (response.data.success) setStats(response.data.data);
    } catch (err) {
      console.log("Dashboard Error", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <p>Loading dashboard…</p>;

  // Helper to get chart height based on screen width
  const getChartHeight = () => (window.innerWidth < 768 ? 250 : 180);

  const orderStatusData = {
    labels: stats.orderStatusChart.map((s) => s._id),
    datasets: [
      {
        label: "Order Count",
        data: stats.orderStatusChart.map((s) => s.count),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const monthlyRevenueData = {
    labels: stats.monthlyRevenue.map((m) => `Month ${m._id}`),
    datasets: [
      {
        label: "Revenue",
        data: stats.monthlyRevenue.map((m) => m.revenue),
        borderColor: "rgba(255,99,132,1)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="px-2 md:px-4 py-4 w-full overflow-x-hidden">
      <h1 className="text-base md:text-xl font-bold mb-4">
        Admin Dashboard Overview
      </h1>

      {/* Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 md:gap-4 mb-4">
        <Indicator title="Users" value={stats.totalUsers} />
        <Indicator title="Orders" value={stats.totalOrders} />
        <Indicator title="Products" value={stats.totalProducts} />
        <Indicator title="Categories" value={stats.totalCategories} />
        <Indicator title="Subcategories" value={stats.totalSubcategories} />
      </div>

      {/* Order Status Chart */}
      <div className="bg-white p-2 md:p-3 rounded shadow mb-4 w-full max-w-full overflow-hidden">
        <h2 className="font-bold text-sm md:text-base mb-2">
          Order Status Chart
        </h2>
        <div className="w-full max-w-full overflow-x-hidden">
          <Bar
            data={orderStatusData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { font: { size: 8 } } } },
              layout: { padding: 0 },
            }}
            height={getChartHeight()} // taller on mobile
          />
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white p-2 md:p-3 rounded shadow mb-4 w-full max-w-full overflow-hidden">
        <h2 className="font-bold text-sm md:text-base mb-2">Monthly Revenue</h2>
        <div className="w-full max-w-full overflow-x-hidden">
          <Line
            data={monthlyRevenueData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { font: { size: 8 } } } },
              layout: { padding: 0 },
            }}
            height={getChartHeight()} // taller on mobile
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-2 md:p-3 rounded shadow w-full max-w-full overflow-x-hidden">
        <h2 className="font-bold text-sm md:text-base mb-2">Recent Orders</h2>

        {/* Desktop Table */}
        <div className="hidden md:block w-full overflow-hidden">
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Order Date</th>
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => {
                const formattedDate = new Date(o.createdAt).toLocaleDateString(
                  "en-GB"
                );
                return (
                  <tr key={o._id} className="border-b">
                    <td className="p-2">{formattedDate}</td>
                    <td className="p-2">{o.orderId}</td>
                    <td className="p-2">{o.userId?.name}</td>
                    <td className="p-2">${Number(o.totalAmt).toFixed(2)}</td>
                    <td className="p-2">{o.orderStatus}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-1 w-full">
          {stats.recentOrders.map((o) => {
            const formattedDate = new Date(o.createdAt).toLocaleDateString(
              "en-GB"
            );

            return (
              <div
                key={o._id}
                className="border rounded p-1 shadow-sm w-full max-w-full overflow-hidden"
              >
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="font-semibold">Date:</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="font-semibold">Order ID:</span>
                  <span>{o.orderId}</span>
                </div>
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="font-semibold">Customer:</span>
                  <span>{o.userId?.name}</span>
                </div>
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="font-semibold">Total:</span>
                  <span>${Number(o.totalAmt).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="font-semibold">Status:</span>
                  <span>{o.orderStatus}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Indicator = ({ title, value }) => (
  <div className="bg-blue-100 p-1 md:p-4 rounded shadow flex flex-col items-center w-full max-w-full overflow-hidden">
    <div className="text-[10px] md:text-lg font-bold">{value}</div>
    <div className="text-[8px] md:text-sm text-center">{title}</div>
  </div>
);

export default AdminDashboard;
