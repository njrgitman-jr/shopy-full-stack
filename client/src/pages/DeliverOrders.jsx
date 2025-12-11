import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const deliveryStatusList = [
  "Pending",
  "Accepted",
  "Rejected",
  "OnTheWayToPickup",
  "ArrivedAtPickup",
  "PickedUp",
  "OnTheWayToCustomer",
  "ArrivedAtCustomer",
  "DeliveredSuccessfully",
  "FailedDelivery",
  "ReturnToSeller",
];

export default function DeliverOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const loadOrders = async () => {
    const res = await fetch(SummaryApi.deliveryAssignedOrders.url, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      setOrders(data.data);
      setFilteredOrders(data.data);
    }
  };

  const updateStatus = async (orderId, status) => {
    const res = await fetch(SummaryApi.deliveryUpdateStatus.url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderId, deliveryStatus: status }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Updated!");
      loadOrders();
    } else {
      toast.error(data.message);
    }
  };

  // filtering + sorting logic
  useEffect(() => {
    let list = [...orders];

    // Status filter
    if (statusFilter) {
      list = list.filter((o) => o.deliveryStatus === statusFilter);
    }

    // Date filter
    const now = new Date();
    list = list.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

      if (dateFilter === "today") return diffDays < 1;
      if (dateFilter === "7days") return diffDays <= 7;
      if (dateFilter === "30days") return diffDays <= 30;
      return true;
    });

    // Sorting
    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "highAmount") {
      list.sort((a, b) => b.totalAmt - a.totalAmt);
    } else if (sortBy === "lowAmount") {
      list.sort((a, b) => a.totalAmt - b.totalAmt);
    }

    setFilteredOrders(list);
  }, [statusFilter, dateFilter, sortBy, orders]);

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">My Delivery Orders</h1>
        <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap flex items-center justify-center">
          {filteredOrders.length} Orders
        </span>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded bg-white"
        >
          <option value="">All Status</option>
          {deliveryStatusList.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* date filter */}
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

        {/* sort filter */}
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
            className={`shadow rounded-lg p-4 w-full overflow-hidden border-2 ${
              idx % 2 === 0
                ? "border-blue-500 bg-blue-50"
                : "border-green-500 bg-green-50"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
              <p>
                <b>Order ID:</b> {o.orderId}
              </p>
              <p>
                <b>Order Date:</b> {new Date(o.createdAt).toLocaleString()}
              </p>
              <p>
                <b>Assigned At:</b>{" "}
                {o.assignedAt ? new Date(o.assignedAt).toLocaleString() : "—"}
              </p>
              <p>
                <b>Amount:</b> ${Number(o.totalAmt).toFixed(3)}
              </p>
            </div>

            <p className="text-sm">
              <b>Status:</b> {o.orderStatus}
            </p>

            <p className="mt-2 font-semibold">Delivery Status:</p>
            <select
              value={o.deliveryStatus}
              onChange={(e) => updateStatus(o.orderId, e.target.value)}
              className="border rounded w-full p-2 mt-1 bg-white"
            >
              {deliveryStatusList.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <h3 className="mt-3 font-semibold">Items:</h3>

            <div className="flex flex-col gap-3 mt-2">
              {o.items?.map((item, idx2) => (
                <div
                  key={idx2}
                  className="border rounded p-3 w-full overflow-hidden bg-white"
                >
                  <div className="mb-2">
                    <p className="font-semibold break-words">
                      {item.product_details?.name}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    <p className="text-gray-700 font-semibold">
                      Price: ${item.product_details?.price || 0}
                    </p>
                  </div>

                  <div className="flex gap-2 overflow-x-auto max-w-full">
                    {Array.isArray(item.product_details?.image)
                      ? item.product_details.image.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={item.product_details?.name || ""}
                            className="w-20 h-20 rounded object-cover flex-shrink-0"
                          />
                        ))
                      : item.product_details?.image && (
                          <img
                            src={item.product_details.image}
                            alt={item.product_details?.name || ""}
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
