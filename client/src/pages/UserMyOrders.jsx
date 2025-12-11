import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";

export default function UserMyOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");

  const loadOrders = async () => {
    const res = await fetch(SummaryApi.userMyOrders.url, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      setOrders(data.data);
      setFilteredOrders(data.data);
    }
  };

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

    setFilteredOrders(list);
  }, [dateFilter, orders]);

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base font-bold">My Orders</h1>
        <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
          {filteredOrders.length} Orders
        </span>
      </div>

      {/* DATE FILTER ONLY */}
      <div className="mb-4">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded bg-white text-sm"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* ORDER CARDS */}
      <div className="grid gap-4">
        {filteredOrders.map((o, idx) => (
          <div
            key={o._id}
            className={`shadow rounded-lg p-4 w-full text-sm overflow-hidden border-2 ${
              idx % 2 === 0
                ? "border-blue-400 bg-blue-50"
                : "border-green-400 bg-green-50"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <p>
                <b>Order ID:</b> {o.orderId}
              </p>
              <p>
                <b>Order Date:</b> {new Date(o.createdAt).toLocaleString()}
              </p>
              <p>
                <b>Amount:</b> ${Number(o.totalAmt).toFixed(3)}
              </p>
            </div>

            <p className="font-semibold">
              Delivery Status:{" "}
              <span className="text-blue-700">{o.deliveryStatus}</span>
            </p>

            <h3 className="mt-3 font-semibold">Items:</h3>
            <div className="flex flex-col gap-3 mt-2">
              {o.items?.map((item, i) => (
                <div
                  key={i}
                  className="border rounded p-3 bg-white overflow-hidden"
                >
                  <p className="font-semibold">{item.product_details?.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p className="font-semibold text-gray-700">
                    Price: ${item.product_details?.price}
                  </p>

                  <div className="flex gap-2 overflow-x-auto mt-2">
                    {(item.product_details?.image || []).map((img, k) => (
                      <img
                        key={k}
                        src={img}
                        className="w-20 h-20 rounded object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center mt-6 text-gray-500">No orders found.</p>
      )}
    </div>
  );
}
