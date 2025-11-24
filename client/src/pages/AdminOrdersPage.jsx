import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios';  // Custom Axios instance
import SummaryApi from '../common/SummaryApi';  // API methods
import { useNavigate } from 'react-router-dom';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await Axios.get(SummaryApi.getOrderItems.url);
        setOrders(response.data.data);
      } catch (error) {
        setError('Error fetching orders. Please try again.');
        console.error('Error fetching orders', error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderUpdate = async (orderId, updatedStatus) => {
    // Logic to update order status
    try {
      const response = await Axios.put(`${SummaryApi.getOrderItems.url}/${orderId}`, { orderStatus: updatedStatus });
      if (response.data.success) {
        setOrders(orders.map(order => 
          order.orderId === orderId ? { ...order, orderStatus: updatedStatus } : order
        ));
        alert('Order status updated successfully!');
      } else {
        setError('Failed to update order status.');
      }
    } catch (error) {
      setError('Error updating order. Please try again.');
      console.error('Error updating order', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Order Management</h1>

      {/* Display error message if any */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Customer Name</th>
            <th className="px-4 py-2 border">Delivery Address</th>
            <th className="px-4 py-2 border">Product Name(s)</th>
            <th className="px-4 py-2 border">Total Amount</th>
           
            <th className="px-4 py-2 border">Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td className="px-4 py-2 border">{order.orderId}</td>
              <td className="px-4 py-2 border">{order.userId?.name}</td>
              <td className="px-4 py-2 border">{order.delivery_address?.address}</td>

              {/* Ensure product_details is an array, otherwise show 'No products' */}
              <td className="px-4 py-2 border">
                {Array.isArray(order.product_details) && order.product_details.length > 0
                  ? order.product_details.map(product => product.name).join(', ')
                  : 'No products available'}
              </td>

              <td className="px-4 py-2 border">{order.totalAmt}</td>
           

              {/* Add dropdown to update order status */}
              <td className="px-4 py-2 border">
                <select 
                  className="p-2 border"
                  value={order.orderStatus}
                  onChange={(e) => handleOrderUpdate(order.orderId, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="ReadyForDispatch">ReadyForDispatch</option>
                  <option value="OutForDelivery">OutForDelivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="FailedDelivery">FailedDelivery</option>
                  <option value="Returned">Returned</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersPage;
