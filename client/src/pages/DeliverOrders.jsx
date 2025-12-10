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

  const loadOrders = async () => {
    const res = await fetch(SummaryApi.deliveryAssignedOrders.url, {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) setOrders(data.data);
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

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">My Delivery Orders</h1>

      <div className="grid gap-4">
        {orders.map((o, idx) => (
          <div
            key={o._id}
            className={`
              shadow rounded-lg p-4 w-full overflow-hidden border-2
              ${idx % 2 === 0 ? "border-blue-500 bg-blue-50" : "border-green-500 bg-green-50"}
            `}
          >
            {/* Header */}
            <div className="flex justify-between flex-wrap gap-2">
              <h2 className="font-semibold text-lg break-all">{o.orderId}</h2>
              <span className="text-xs whitespace-nowrap">
                {new Date(o.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="mt-1 text-sm">
              <p>
                <b>Amount:</b> ${o.totalAmt}
              </p>
              <p>
                <b>Status:</b> {o.orderStatus}
              </p>

              {/* Delivery Status */}
              <p className="mt-2 font-semibold">Delivery Status:</p>
              <select
                onChange={(e) => updateStatus(o.orderId, e.target.value)}
                value={o.deliveryStatus}
                className="border rounded w-full p-2 mt-1 bg-white"
              >
                {deliveryStatusList.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {/* Items List */}
              <h3 className="mt-3 font-semibold">Items:</h3>

              <div className="flex flex-col gap-3 mt-2">
                {o.items?.map((item, idx2) => (
                  <div
                    key={idx2}
                    className="border rounded p-3 w-full overflow-hidden bg-white"
                  >
                    {/* PRODUCT INFO */}
                    <div className="mb-2">
                      <p className="font-semibold break-words">
                        {item.product_details?.name}
                      </p>
                      <p>Qty: {item.quantity}</p>
                      <p className="text-gray-700 font-semibold">
                        Price: ${item.product_details?.price || 0}
                      </p>
                    </div>

                    {/* IMAGES */}
                    <div className="flex gap-2 overflow-x-auto max-w-full">
                      {Array.isArray(item.product_details?.image) ? (
                        item.product_details.image.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={item.product_details?.name || ""}
                            className="w-20 h-20 rounded object-cover flex-shrink-0"
                          />
                        ))
                      ) : item.product_details?.image ? (
                        <img
                          src={item.product_details.image}
                          alt={item.product_details?.name || ""}
                          className="w-20 h-20 rounded object-cover flex-shrink-0"
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No orders found.</p>
      )}
    </div>
  );
}
