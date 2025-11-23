import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios"; 
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // FETCH ORDERS WITH PAGINATION
  // -----------------------------------------
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getAllOrdersAdmin,
        params: { page, limit: 10 },
      });

      if (response.data.success) {
        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.data.message || "Failed to load orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  // -----------------------------------------
  // HANDLE PAGE CHANGE
  // -----------------------------------------
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-5">Admin Orders</h1>

      {/* LOADING INDICATOR */}
      {loading && (
        <div className="text-center py-4 text-lg font-medium">
          Loading orders...
        </div>
      )}

      {/* ORDERS TABLE */}
      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.orderId}</td>
                  <td className="p-3">
                    {order.userId?.name} <br />
                    <small className="text-gray-500">{order.userId?.email}</small>
                  </td>
                  <td className="p-3">${order.totalAmount}</td>
                  <td className="p-3">{order.orderStatus}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NO DATA */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-5 text-gray-500 text-lg">
          No Orders Found
        </div>
      )}

      {/* PAGINATION */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-medium">
            Page {pagination.page} / {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
