// client/src/pages/AdminOrdersPage.jsx
import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

/**
 * Admin Orders Page
 *
 * Features:
 * - fetch admin orders (adminListOrders)
 * - fetch delivery persons (getDeliveryPersons)
 * - inline delivery person select + confirm (save / cancel)
 * - update status via action menu
 * - view products & extra info in modal
 * - responsive: table desktop, cards mobile
 * - small built-in toast for success/error
 *
 * Tailwind used for styling.
 */

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "ReadyForDispatch",
  "OutForDelivery",
  "Delivered",
  "FailedDelivery",
  "Returned",
  "Cancelled",
];

function Toast({ toast, remove }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => remove(), 3500);
    return () => clearTimeout(timer);
  }, [toast, remove]);
  if (!toast) return null;
  return (
    <div className="fixed right-4 top-6 z-50">
      <div
        className={`px-4 py-2 rounded shadow-md text-white ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {toast.message}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null); // orderId being edited for delivery person
  const [selectedDelivery, setSelectedDelivery] = useState({}); // { orderId: deliveryPersonId }
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [actionOpenFor, setActionOpenFor] = useState(null);

  // Fetch admin orders and delivery persons
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [ordersRes, delRes] = await Promise.all([
          Axios.get(SummaryApi.adminListOrders.url),
          Axios.get(SummaryApi.getDeliveryPersons.url || SummaryApi.getDeliveryPersons), // just in case
        ]);
        setOrders(ordersRes.data.data || []);
        setDeliveryPersons(delRes.data.data || []);
      } catch (err) {
        console.error("AdminOrders fetch error", err);
        setError("Unable to load orders. Please try again.");
        setToast({ type: "error", message: "Failed to load orders" });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // helper toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };
  const removeToast = () => setToast(null);

  // Start inline edit (delivery person)
  const startEditDelivery = (orderId, currentDeliveryId) => {
    setEditingRow(orderId);
    setSelectedDelivery({ ...selectedDelivery, [orderId]: currentDeliveryId || "" });
  };

  const cancelEditDelivery = (orderId) => {
    const copy = { ...selectedDelivery };
    delete copy[orderId];
    setSelectedDelivery(copy);
    setEditingRow(null);
  };

  // Save delivery person (confirm then call API)
  const saveDelivery = async (order) => {
    const orderId = order.orderId;
    const deliveryPersonId = selectedDelivery[orderId];
    const person = deliveryPersons.find((p) => String(p._id) === String(deliveryPersonId));
    const deliveryPersonName = person ? person.name : "";

    const confirmed = window.confirm(
      `Assign "${deliveryPersonName || "Unknown"}" to order ${orderId}?`
    );
    if (!confirmed) return;

    try {
      const url = `${SummaryApi.assignDelivery.url}/${orderId}`;
      const res = await Axios.put(url, { deliveryPersonId, deliveryPersonName });
      // update local list
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? res.data.data : o)));
      showToast("success", `Assigned ${deliveryPersonName} to ${orderId}`);
    } catch (err) {
      console.error("assign error", err);
      showToast("error", "Failed to assign delivery person");
    } finally {
      setEditingRow(null);
    }
  };

  // Update status
  const updateStatus = async (order, status) => {
    const confirmed = window.confirm(`Change status of ${order.orderId} to "${status}"?`);
    if (!confirmed) return;
    try {
      const url = `${SummaryApi.adminUpdateStatus.url}/${order.orderId}`;
      const res = await Axios.put(url, { status });
      setOrders((prev) => prev.map((o) => (o.orderId === order.orderId ? res.data.data : o)));
      showToast("success", `Order ${order.orderId} status updated`);
    } catch (err) {
      console.error("update status error", err);
      showToast("error", "Failed to update status");
    } finally {
      setActionOpenFor(null);
    }
  };

  // open modal with order details (products etc)
  const openModal = (order) => {
    setModalOrder(order);
    setShowModal(true);
    setActionOpenFor(null);
  };

  // UI pieces
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Order Management</h1>
        <div>Loading orders…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Order Management</h1>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Toast toast={toast} remove={removeToast} />

      <h1 className="text-2xl font-semibold mb-4">Order Management</h1>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left border">Order ID</th>
              <th className="px-3 py-2 text-left border">Customer</th>
              <th className="px-3 py-2 text-left border">Delivery Address</th>
              <th className="px-3 py-2 text-left border">Products</th>
              <th className="px-3 py-2 text-right border">Total</th>
              <th className="px-3 py-2 text-left border">Payment</th>
              <th className="px-3 py-2 text-left border">Delivery Status</th>
              <th className="px-3 py-2 text-left border">Delivery Person</th>
              <th className="px-3 py-2 text-left border">Assigned At</th>
              <th className="px-3 py-2 text-left border">Order Date</th>
              <th className="px-3 py-2 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const products =
                Array.isArray(order.product_details) && order.product_details.length
                  ? order.product_details.map((p) => p.name).join(", ")
                  : order.product_details?.name || order.productId?.name || "—";
              return (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border">{order.orderId}</td>
                  <td className="px-3 py-2 border">{order.userId?.name || "—"}</td>
                  <td className="px-3 py-2 border">
                    {order.delivery_address?.address || order.delivery_address?.full || "—"}
                  </td>
                  <td className="px-3 py-2 border max-w-xs truncate" title={products}>
                    {products}
                  </td>
                  <td className="px-3 py-2 border text-right">{order.totalAmt ?? "—"}</td>
                  <td className="px-3 py-2 border">{order.payment_status || "—"}</td>
                  <td className="px-3 py-2 border">{order.orderStatus}</td>

                  {/* Delivery person cell - inline select */}
                  <td className="px-3 py-2 border">
                    {editingRow === order.orderId ? (
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={selectedDelivery[order.orderId] ?? (order.delivery_person?._id || "")}
                          onChange={(e) =>
                            setSelectedDelivery({ ...selectedDelivery, [order.orderId]: e.target.value })
                          }
                        >
                          <option value="">-- Select --</option>
                          {deliveryPersons.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <button
                          className="px-2 py-1 rounded bg-green-600 text-white text-sm"
                          onClick={() => saveDelivery(order)}
                        >
                          Save
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-gray-200 text-sm"
                          onClick={() => cancelEditDelivery(order.orderId)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{order.delivery_person_name || "—"}</span>
                        <button
                          className="ml-2 px-2 py-1 rounded-full border text-sm"
                          onClick={() => startEditDelivery(order.orderId, order.delivery_person)}
                          title="Assign / change delivery person"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-3 py-2 border">
                    {order.assignedAt ? new Date(order.assignedAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 border">{new Date(order.createdAt).toLocaleString()}</td>

                  {/* Actions column: 3-dots rounded button */}
                  <td className="px-3 py-2 border relative">
                    <div className="flex items-center">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 border"
                        onClick={() => setActionOpenFor(actionOpenFor === order.orderId ? null : order.orderId)}
                        title="Actions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {actionOpenFor === order.orderId && (
                        <div className="absolute right-0 mt-10 z-40 bg-white border rounded shadow-sm w-44">
                          <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-50"
                            onClick={() => {
                              startEditDelivery(order.orderId, order.delivery_person?._id);
                              setActionOpenFor(null);
                            }}
                          >
                            Assign Delivery
                          </button>

                          <div className="border-t" />

                          <div className="px-3 py-2">
                            <div className="text-xs text-gray-500 mb-1">Update Status</div>
                            {STATUS_OPTIONS.map((s) => (
                              <button
                                key={s}
                                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded"
                                onClick={() => updateStatus(order, s)}
                              >
                                {s}
                              </button>
                            ))}
                          </div>

                          <div className="border-t" />
                          <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-50"
                            onClick={() => openModal(order)}
                          >
                            View Products
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-4">
        {orders.map((order) => {
          const products =
            Array.isArray(order.product_details) && order.product_details.length
              ? order.product_details.map((p) => p.name).join(", ")
              : order.product_details?.name || order.productId?.name || "—";

          return (
            <div key={order.orderId} className="border rounded p-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{order.orderId}</div>
                  <div className="text-sm text-gray-600">{order.userId?.name || "—"}</div>
                </div>
                <div>
                  <button
                    className="p-2 rounded-full border"
                    onClick={() => setActionOpenFor(actionOpenFor === order.orderId ? null : order.orderId)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Address</span><span>{order.delivery_address?.address || "—"}</span></div>
                <div className="flex justify-between mt-1"><span className="text-gray-600">Products</span><span className="truncate max-w-xs">{products}</span></div>
                <div className="flex justify-between mt-1"><span className="text-gray-600">Total</span><span>{order.totalAmt ?? "—"}</span></div>
                <div className="flex justify-between mt-1"><span className="text-gray-600">Status</span><span>{order.orderStatus}</span></div>
              </div>

              {/* delivery person small */}
              <div className="mt-3">
                {editingRow === order.orderId ? (
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded px-2 py-1 text-sm flex-1"
                      value={selectedDelivery[order.orderId] ?? (order.delivery_person?._id || "")}
                      onChange={(e) =>
                        setSelectedDelivery({ ...selectedDelivery, [order.orderId]: e.target.value })
                      }
                    >
                      <option value="">-- Select --</option>
                      {deliveryPersons.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <button className="px-2 py-1 rounded bg-green-600 text-white text-sm" onClick={() => saveDelivery(order)}>Save</button>
                    <button className="px-2 py-1 rounded bg-gray-200 text-sm" onClick={() => cancelEditDelivery(order.orderId)}>Cancel</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      <div><span className="text-gray-500">Delivery:</span> {order.delivery_person_name || "—"}</div>
                      <div className="text-xs text-gray-400">Assigned: {order.assignedAt ? new Date(order.assignedAt).toLocaleString() : "—"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 border rounded" onClick={() => startEditDelivery(order.orderId, order.delivery_person?._id)}>Assign</button>
                      <button className="px-2 py-1 border rounded" onClick={() => openModal(order)}>Products</button>
                    </div>
                  </div>
                )}
              </div>

              {/* action popup on small */}
              {actionOpenFor === order.orderId && (
                <div className="mt-2 border-t pt-2">
                  <button className="w-full text-left px-2 py-2 hover:bg-gray-50" onClick={() => { startEditDelivery(order.orderId, order.delivery_person?._id); setActionOpenFor(null); }}>
                    Assign Delivery
                  </button>
                  <div className="text-xs text-gray-500 px-2 py-1">Update Status</div>
                  <div className="flex flex-wrap gap-1 px-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button key={s} className="px-2 py-1 border rounded text-xs" onClick={() => updateStatus(order, s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal - view products and extra info */}
      {showModal && modalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Order {modalOrder.orderId}</h2>
              <button className="px-2 py-1 rounded border" onClick={() => setShowModal(false)}>Close</button>
            </div>

            <div className="space-y-3 text-sm">
              <div><strong>Customer:</strong> {modalOrder.userId?.name}</div>
              <div><strong>Address:</strong> {modalOrder.delivery_address?.address || "—"}</div>
              <div><strong>Total:</strong> {modalOrder.totalAmt ?? "—"}</div>
              <div><strong>Payment:</strong> {modalOrder.payment_status}</div>
              <div><strong>Status:</strong> {modalOrder.orderStatus}</div>
              <div><strong>Assigned:</strong> {modalOrder.delivery_person_name || "—"}</div>
              <div>
                <strong>Products:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {Array.isArray(modalOrder.product_details) && modalOrder.product_details.length > 0 ? (
                    modalOrder.product_details.map((p, idx) => (
                      <li key={idx}>
                        {p.name} {p?.qty ? `x${p.qty}` : ""}
                      </li>
                    ))
                  ) : modalOrder.product_details?.name ? (
                    <li>{modalOrder.product_details.name}</li>
                  ) : modalOrder.productId?.name ? (
                    <li>{modalOrder.productId.name}</li>
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
