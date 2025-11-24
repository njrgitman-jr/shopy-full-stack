import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios'; // Custom Axios instance
import SummaryApi from '../common/SummaryApi'; // API methods
import { useNavigate } from 'react-router-dom';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await Axios.get(SummaryApi.getOrderItems.url);
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders', error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderUpdate = async (orderId, updatedStatus) => {
    // Logic to update order status
    try {
      await Axios.put(`${SummaryApi.getOrderItems.url}/${orderId}`, { status: updatedStatus });
      setOrders(orders.map(order => order.orderId === orderId ? { ...order, orderStatus: updatedStatus } : order));
    } catch (error) {
      console.error('Error updating order', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Order Management</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Customer Name</th>
            <th className="px-4 py-2 border">Delivery Address</th>
            <th className="px-4 py-2 border">Product Name(s)</th>
            <th className="px-4 py-2 border">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td className="px-4 py-2 border">{order.orderId}</td>
              <td className="px-4 py-2 border">{order.userId?.name}</td>
              <td className="px-4 py-2 border">{order.delivery_address?.address}</td>
              <td className="px-4 py-2 border">{order.product_details?.name}</td>
              <td className="px-4 py-2 border">{order.totalAmt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersPage;
