// client/src/pages/AdminOrdersPage.jsx
import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast, { Toaster } from "react-hot-toast";


const PAGE_LIMIT = 10;

const statusOptions = [
  "Pending",
  "Processing",
  "ReadyForDispatch",
  "OutForDelivery",
  "Delivered",
  "FailedDelivery",
  "Returned",
  "Cancelled",
];

const paymentStatuses = [
  "COD Pending",
  "COD Paid",
  "COD Failed",
  "COD Refunded",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(PAGE_LIMIT);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, limit]);

  const fetchDeliveryPersons = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getDeliveryPersons,
      });
      setDeliveryPersons(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getAdminOrders,
        params: { page, limit },
      });
      const { data } = res.data;
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
        toast.success("Error", err?.response?.data?.message || "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (order) => {
    setEditingId(order._id);
    setEditData({
      payment_status: order.payment_status,
      orderStatus: order.orderStatus,
      delivery_person: order.delivery_person?._id || order.delivery_person || null,
      // assignedAt remains controlled by server when assigning
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (orderId) => {
    try {
      setLoading(true);

      // Build payload with only allowed fields
      const payload = {
        ...(editData.payment_status !== undefined && { payment_status: editData.payment_status }),
        ...(editData.orderStatus !== undefined && { orderStatus: editData.orderStatus }),
        ...(editData.delivery_person !== undefined && { delivery_person: editData.delivery_person }),
      };

      const res = await Axios({
        ...SummaryApi.updateAdminOrder,
        url: SummaryApi.updateAdminOrder.url.replace(":id", orderId),
        method: SummaryApi.updateAdminOrder.method,
        data: payload,
      });

      toast.success("Order updated");
      // Refresh single order or list
      await fetchOrders();
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error(err);
 
       toast.success("Error", err?.response?.data?.message || "Failed to update order", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setEditData((p) => ({ ...p, [field]: value }));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Orders</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Delivery Address</th>
              <th className="px-4 py-2 text-left">Products</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Payment Status</th>
              <th className="px-4 py-2 text-left">Delivery Status</th>
              <th className="px-4 py-2 text-left">Delivery Person</th>
              <th className="px-4 py-2 text-left">Assigned At</th>
              <th className="px-4 py-2 text-left">Order Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="11" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="11" className="p-6 text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isEditing = editingId === order._id;

                // product names fallback
                const productNames = (() => {
                  if (Array.isArray(order.product_details?.name)) {
                    return order.product_details.name.join(", ");
                  }
                  if (order.product_details?.name) return order.product_details.name;
                  if (order.productId?.name) return order.productId.name;
                  return "—";
                })();

                const addressText = (() => {
                  if (typeof order.delivery_address === "string") return order.delivery_address;
                  if (order.delivery_address?.addressLine) return order.delivery_address.addressLine;
                  if (order.delivery_address?.street)
                    return `${order.delivery_address.street} ${order.delivery_address.city || ""}`;
                  return "—";
                })();

                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{order.orderId}</td>
                    <td className="px-4 py-2 text-sm">{order.userId?.name || "—"}</td>
                    <td className="px-4 py-2 text-sm">{addressText}</td>
                    <td className="px-4 py-2 text-sm">{productNames}</td>
                    <td className="px-4 py-2 text-sm">{order.totalAmt?.toFixed?.(2) ?? order.totalAmt}</td>

                    <td className="px-4 py-2 text-sm">
                      {isEditing ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={editData.payment_status}
                          onChange={(e) => handleChange("payment_status", e.target.value)}
                        >
                          <option value="">--</option>
                          {paymentStatuses.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      ) : (
                        order.payment_status
                      )}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {isEditing ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={editData.orderStatus}
                          onChange={(e) => handleChange("orderStatus", e.target.value)}
                        >
                          <option value="">--</option>
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        order.orderStatus
                      )}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {isEditing ? (
                        <select
                          className="border rounded px-2 py-1 max-w-xs"
                          value={editData.delivery_person || ""}
                          onChange={(e) => handleChange("delivery_person", e.target.value || null)}
                        >
                          <option value="">-- Unassigned --</option>
                          {deliveryPersons.map((d) => (
                            <option key={d._id} value={d._id}>
                              {d.name} {d.mobile ? `(${d.mobile})` : ""}
                            </option>
                          ))}
                        </select>
                      ) : (
                        order.delivery_person_name || order.delivery_person?.name || "—"
                      )}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {order.assignedAt ? new Date(order.assignedAt).toLocaleString() : "—"}
                    </td>

                    <td className="px-4 py-2 text-sm">{new Date(order.createdAt).toLocaleString()}</td>

                    <td className="px-4 py-2 text-sm">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded bg-green-600 text-white text-sm"
                            onClick={() => handleSave(order._id)}
                          >
                            Save
                          </button>
                          <button
                            className="px-3 py-1 rounded border text-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                            onClick={() => startEdit(order)}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm">Showing page {page} of {totalPages} — {total} orders</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          {/* page numbers: show a few */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((_, idx, arr) => {
              const pageNumber = idx + Math.max(1, page - 2);
              return (
                <button
                  key={pageNumber}
                  className={`px-3 py-1 rounded ${pageNumber === page ? "bg-gray-800 text-white" : "border"}`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
