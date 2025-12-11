import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import { useSelector } from "react-redux";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const user = useSelector((state) => state.user);

  // must be logged in
  if (!user?._id) {
    return (
      <p className="text-center mt-6 text-gray-600">
        Please login to view your orders.
      </p>
    );
  }

  const loadOrders = async () => {
    const res = await fetch(
      SummaryApi.myOrders.url + "?userId=" + user._id,
      {
        credentials: "include",
      }
    );
    const data = await res.json();

    if (data.success) {
      setOrders(data.data);
      setFilteredOrders(data.data);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let list = [...orders];

    const now = new Date();
    list = list.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

      if (dateFilter === "today") return diffDays < 1;
      if (dateFilter === "7days") return diffDays <= 7;
      if (dateFilter === "30days") return diffDays <= 30;
      return true;
    });

    if (sortBy === "newest")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "highAmount") list.sort((a, b) => b.totalAmt - a.totalAmt);
    if (sortBy === "lowAmount") list.sort((a, b) => a.totalAmt - b.totalAmt);

    setFilteredOrders(list);
  }, [dateFilter, sortBy, orders]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">My Orders</h1>
        <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap flex items-center justify-center">
          {filteredOrders.length} Orders
        </span>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded bg-white"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highAmount">Highest Amount</option>
          <option value="lowAmount">Lowest Amount</option>
        </select>
      </div>

      {/* ORDER CARDS */}
      <div className="grid gap-4">
        {filteredOrders.map((o, idx) => (
          <div
            key={o._id}
            className={`shadow rounded-lg p-4 w-full border-2 ${
              idx % 2 === 0
                ? "border-blue-500 bg-blue-50"
                : "border-green-500 bg-green-50"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
              <p><b>Order ID:</b> {o.orderId}</p>
              <p><b>Order Date:</b> {new Date(o.createdAt).toLocaleString()}</p>
              <p><b>Amount:</b> ${Number(o.totalAmt).toFixed(2)}</p>
            </div>

            <p className="text-sm"><b>Status:</b> {o.orderStatus}</p>
            <p className="text-sm mt-1"><b>Delivery Status:</b> {o.deliveryStatus}</p>

            <h3 className="mt-3 font-semibold">Items:</h3>

            <div className="flex flex-col gap-3 mt-2">
              {o.items.map((item, i) => (
                <div
                  key={i}
                  className="border rounded p-3 bg-white"
                >
                  <p className="font-semibold">{item.product_details?.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p className="font-semibold">Price: ${item.product_details?.price}</p>

                  <div className="flex gap-2 overflow-x-auto mt-2">
                    {Array.isArray(item.product_details?.image)
                      ? item.product_details.image.map((img, idx3) => (
                          <img
                            key={idx3}
                            src={img}
                            className="w-20 h-20 rounded object-cover flex-shrink-0"
                          />
                        ))
                      : item.product_details?.image && (
                          <img
                            src={item.product_details.image}
                            className="w-20 h-20 rounded object-cover flex-shrink-0"
                          />
                        )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No orders found.</p>
      )}
    </div>
  );
}
