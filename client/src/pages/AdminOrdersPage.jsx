import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";


function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({});

  // Load orders
  const fetchOrders = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.adminListOrders,
      });

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const startEdit = (order) => {
    setEditRow(order.orderId);
    setFormData({
      payment_status: order.payment_status,
      orderStatus: order.orderStatus,
    });
  };

  const saveEdit = async (orderId) => {
    try {
      await Axios({
        ...SummaryApi.adminUpdateOrder,
        data: {
          orderId,
          field: "payment_status",
          value: formData.payment_status,
        },
      });

      await Axios({
        ...SummaryApi.adminUpdateOrder,
        data: {
          orderId,
          field: "orderStatus",
          value: formData.orderStatus,
        },
      });

      successAlert("Updated Successfully");

      setEditRow(null);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-5">Admin Orders Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg border">
          <thead className="bg-gray-200 text-sm font-semibold text-gray-700">
            <tr>
              <th className="p-3 border">Order IDXX</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Delivery Address</th>
              <th className="p-3 border">Product Name</th>
              <th className="p-3 border">Total Amount</th>
              <th className="p-3 border">Payment Status</th>
              <th className="p-3 border">Order Status</th>
              <th className="p-3 border">Assigned At</th>
              <th className="p-3 border">Order Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b hover:bg-gray-100">
                <td className="p-3 border">{order.orderId}</td>
                <td className="p-3 border">{order.userId?.name}</td>
                <td className="p-3 border">
                  {order.delivery_address?.street ||
                    order.delivery_address?.addressLine1}
                </td>
                <td className="p-3 border">{order.product_details?.name}</td>
                <td className="p-3 border">{order.totalAmt} JD</td>

                {/* PAYMENT STATUS INLINE */}
                <td className="p-3 border">
                  {editRow === order.orderId ? (
                    <select
                      className="border p-1 rounded"
                      value={formData.payment_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_status: e.target.value,
                        })
                      }
                    >
                      <option>COD Pending</option>
                      <option>COD Paid</option>
                      <option>COD Failed</option>
                      <option>COD Refunded</option>
                    </select>
                  ) : (
                    order.payment_status
                  )}
                </td>

                {/* ORDER STATUS INLINE */}
                <td className="p-3 border">
                  {editRow === order.orderId ? (
                    <select
                      className="border p-1 rounded"
                      value={formData.orderStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orderStatus: e.target.value,
                        })
                      }
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>ReadyForDispatch</option>
                      <option>OutForDelivery</option>
                      <option>Delivered</option>
                      <option>FailedDelivery</option>
                      <option>Returned</option>
                      <option>Cancelled</option>
                    </select>
                  ) : (
                    order.orderStatus
                  )}
                </td>

                <td className="p-3 border">
                  {order.assignedAt
                    ? new Date(order.assignedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3 border">
                  {new Date(order.createdAt).toLocaleString()}
                </td>

                <td className="p-3 border">
                  {editRow === order.orderId ? (
                    <button
                      onClick={() => saveEdit(order.orderId)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(order)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
