import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios"; 
import SummaryApi from "../common/SummaryApi";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);

  useEffect(() => {
    loadOrders();
    loadDeliveryUsers();
  }, []);

  const loadOrders = async () => {
    const response = await Axios({
      url: SummaryApi.adminOrdersList.url,
      method: SummaryApi.adminOrdersList.method,
    });

    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const loadDeliveryUsers = async () => {
    const res = await Axios({
      url: "/api/user/get-delivery-users",
      method: "get",
    });

    if (res.data.success) {
      setDeliveryUsers(res.data.users);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    await Axios({
      url: SummaryApi.adminUpdateOrderStatus.url,
      method: SummaryApi.adminUpdateOrderStatus.method,
      data: { orderId, status: newStatus },
    });

    loadOrders();
  };

  const assignDelivery = async (orderId, userId) => {
    await Axios({
      url: SummaryApi.adminAssignDelivery.url,
      method: SummaryApi.adminAssignDelivery.method,
      data: { orderId, deliveryPersonId: userId },
    });

    loadOrders();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Order Management</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 bg-white shadow rounded-lg border"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold">
                OrderID: <span className="text-blue-600">{order.orderId}</span>
              </p>
              <p className="text-sm">{order.orderStatus}</p>
            </div>

            <p className="text-sm">
              Product: {order.product_details?.name}
            </p>
            <p className="text-sm">
              Buyer: {order.userId?.name} ({order.userId?.email})
            </p>

            {/* Status */}
            <div className="mt-3">
              <label className="text-sm font-medium">Update Status</label>
              <select
                className="border rounded p-2 w-full mt-1"
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="">Select</option>
                <option value="Processing">Processing</option>
                <option value="ReadyForDispatch">Ready For Dispatch</option>
                <option value="OutForDelivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="FailedDelivery">Failed Delivery</option>
              </select>
            </div>

            {/* Delivery */}
            <div className="mt-3">
              <label className="text-sm font-medium">Assign Delivery</label>
              <select
                className="border rounded p-2 w-full mt-1"
                onChange={(e) => assignDelivery(order._id, e.target.value)}
              >
                <option value="">Select delivery</option>
                {deliveryUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
