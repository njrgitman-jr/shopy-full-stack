import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios'; // Custom Axios instance
import SummaryApi from '../common/SummaryApi'; // API methods
import { useNavigate } from 'react-router-dom';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [error, setError] = useState(null);      // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await Axios.get(SummaryApi.getAdminOrders.url);
        setOrders(response.data.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Error fetching orders. Please try again later.');
        setLoading(false); // Set loading to false even when there's an error
        console.error('Error fetching orders', error);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array, so it only runs once when the component mounts

  const handleOrderUpdate = async (orderId, updatedStatus) => {
    // Logic to update order status
    try {
      await Axios.put(`${SummaryApi.getOrderItems.url}/${orderId}`, { status: updatedStatus });
      setOrders(orders.map(order => order.orderId === orderId ? { ...order, orderStatus: updatedStatus } : order));
    } catch (error) {
      console.error('Error updating order', error);
    }
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Order Management</h1>
        <div>Loading orders...</div>
      </div>
    );
  }

  // Show error message if there was an error fetching data
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Order Management</h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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
              <td className="px-4 py-2 border">
                {/* Ensure product_details is an array */}
                {Array.isArray(order.product_details) && order.product_details.length > 0
                  ? order.product_details.map(product => product.name).join(', ')
                  : 'No products available'}
              </td>
              <td className="px-4 py-2 border">{order.totalAmt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersPage;
