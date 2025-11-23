// client/src/pages/AdminOrdersPage.jsx
import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";                 // your Axios wrapper used elsewhere in the app
import SummaryApi from "../common/SummaryApi";      // central API endpoints map
import toast from "react-hot-toast";
import Loading from "../components/Loading";        // reuse your existing Loading component
import NoData from "../components/NoData";          // reuse NoData
import CofirmBox from "../components/CofirmBox";    // reuse your confirm box (used for status change prompt)

/**
 * AdminOrdersPage
 *
 * Full admin orders management page (Option 1)
 * - Server-driven pagination (page, limit)
 * - Inline assignment of delivery person (role "DELV")
 * - Update order status
 * - View product snapshot modal
 * - Refresh and loading states
 *
 * Where to place this file:
 * - client/src/pages/AdminOrdersPage.jsx
 *
 * Integration (client):
 * - Add a route in your app's router: <Route path="/admin/orders" element={<AdminOrdersPage/>} />
 * - Ensure SummaryApi.getAllOrdersAdmin, assignOrderToDelivery, updateOrderStatus and getDeliveryPersons are present.
 *
 * Integration (server):
 * - Make sure server/controllers/adminOrder.controller.js getOrdersAdmin supports pagination params ?page & ?limit
 *   (see integration notes at bottom for exact code to add/replace on server).
 */

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

export default function AdminOrdersPage() {
  // Orders data
  const [orders, setOrders] = useState([]);

  // delivery persons for dropdown (users with role "DELV")
  const [deliveryPersons, setDeliveryPersons] = useState([]);

  // loading states
  const [loading, setLoading] = useState(false);          // initial fetch / refresh
  const [loadingAssign, setLoadingAssign] = useState(false); // assign action
  const [loadingStatus, setLoadingStatus] = useState(false); // status update action

  // pagination state (server-supplied)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
  });

  // selected order for product modal
  const [selectedOrderForProducts, setSelectedOrderForProducts] = useState(null);

  // Confirm box state for status update (we use CofirmBox to confirm update)
  const [confirmBox, setConfirmBox] = useState({ open: false, payload: null });

  // -----------------------
  // FETCH DELIVERY PERSONS
  // -----------------------
  // Purpose: populate dropdown. Protected endpoint: auth + admin on server.
  const fetchDeliveryPersons = async () => {
    try {
      const res = await Axios({ ...SummaryApi.getDeliveryPersons });
      const { data: responseData } = res;
      if (responseData.success) {
        setDeliveryPersons(responseData.data || []);
      } else {
        console.warn("No delivery persons: ", responseData.message);
      }
    } catch (err) {
      console.error("fetchDeliveryPersons:", err);
    }
  };

  // -----------------------
  // FETCH ORDERS (paginated)
  // -----------------------
  // page argument optional — default uses pagination.page
  const fetchOrders = async (page = pagination.page) => {
    try {
      setLoading(true);

      // We use SummaryApi.getAllOrdersAdmin and pass params page & limit.
      // Axios wrapper should forward params on request (like axios does).
      const res = await Axios({
        ...SummaryApi.getAllOrdersAdmin,
        params: { page, limit: pagination.limit },
      });

      const { data: responseData } = res;

      if (responseData.success) {
        // responseData.data contains orders; responseData.pagination contains paging info (server-side)
        setOrders(responseData.data || []);
        // set pagination if server returns pagination object (recommended)
        if (responseData.pagination) {
          setPagination((p) => ({
            ...p,
            page: responseData.pagination.page || page,
            limit: responseData.pagination.limit || p.limit,
            totalPages: responseData.pagination.totalPages || p.totalPages,
            totalCount: responseData.pagination.totalCount || p.totalCount,
          }));
        } else {
          // fallback (if server returned other structure)
          // If server used keys `totalPages, currentPage, totalOrders`:
          if (responseData.totalPages || responseData.currentPage) {
            setPagination((p) => ({
              ...p,
              page: responseData.currentPage || page,
              totalPages: responseData.totalPages || p.totalPages,
              totalCount: responseData.totalOrders || p.totalCount,
            }));
          }
        }
      } else {
        toast.error(responseData.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("fetchOrders error:", err);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // ASSIGN DELIVERY PERSON
  // -----------------------
  // Called when user selects a delivery person from inline dropdown.
  const handleAssign = async (orderId, deliveryUserId) => {
    // validation
    if (!deliveryUserId) return;

    try {
      setLoadingAssign(true);

      const res = await Axios({
        ...SummaryApi.assignOrderToDelivery,
        data: { orderId, delivery_person: deliveryUserId },
      });

      const { data: responseData } = res;
      if (responseData.success) {
        toast.success("Delivery person assigned");
        // update local state for only the updated order (avoid re-fetching entire page)
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, ...responseData.data } : o))
        );
      } else {
        toast.error(responseData.message || "Failed to assign delivery person");
      }
    } catch (err) {
      console.error("handleAssign:", err);
      toast.error("Failed to assign delivery person");
    } finally {
      setLoadingAssign(false);
    }
  };

  // -----------------------
  // UPDATE ORDER STATUS
  // -----------------------
  // update (admin) order status. If Delivered -> server sets deliveredAt
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!newStatus) return;

    try {
      setLoadingStatus(true);
      const res = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderId, orderStatus: newStatus },
      });
      const { data: responseData } = res;
      if (responseData.success) {
        toast.success("Order status updated");
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, ...responseData.data } : o))
        );
      } else {
        toast.error(responseData.message || "Failed to update status");
      }
    } catch (err) {
      console.error("handleUpdateStatus:", err);
      toast.error("Failed to update status");
    } finally {
      setLoadingStatus(false);
    }
  };

  // -----------------------
  // VIEW PRODUCTS (modal)
  // -----------------------
  // Simple modal showing product snapshot saved in order document
  const openViewProducts = (order) => {
    setSelectedOrderForProducts(order);
  };

  const closeViewProducts = () => setSelectedOrderForProducts(null);

  // -----------------------
  // PAGINATION CONTROLS
  // -----------------------
  const gotoPage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchOrders(newPage);
  };

  // -----------------------
  // INITIAL LOAD
  // -----------------------
  useEffect(() => {
    // fetch both lists on initial load
    fetchDeliveryPersons();
    fetchOrders(1); // load first page
    // eslint-disable-next-line
  }, []);

  // -----------------------
  // SMALL RENDER HELPERS
  // -----------------------
  const getProductNames = (order) => {
    if (order.product_details && order.product_details.name) return order.product_details.name;
    if (order.productId && order.productId.name) return order.productId.name;
    return "-";
  };

  const getDeliveryAddressStr = (addr) => {
    // adapt depending on your address schema
    if (!addr) return "-";
    if (typeof addr === "string") return addr;
    // common address fields; adjust as per your schema
    return addr.addressLine || addr.street || addr.city || JSON.stringify(addr);
  };

  // -----------------------
  // JSX
  // -----------------------
  return (
    <section className="p-4">
      {/* Header with counts and refresh */}
      <div className="sticky top-[96px] z-40 p-2 bg-white shadow-md flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium">
            Orders (
            <span className="text-sm text-primary-500 font-semibold">
              {pagination.totalCount || orders.length || 0}
            </span>
            )
          </h2>
          <div className="text-xs text-gray-500">Page {pagination.page} of {pagination.totalPages}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchOrders(pagination.page)}
            className="text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && <Loading />}

      {/* No data */}
      {!loading && !orders[0] && <NoData />}

      {/* Orders table */}
      {!loading && orders[0] && (
        <div className="overflow-auto mt-4">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Customer Name</th>
                <th className="p-2 border">Delivery Address</th>
                <th className="p-2 border">Product Name(s)</th>
                <th className="p-2 border">Total Amount</th>
                <th className="p-2 border">Payment Status</th>
                <th className="p-2 border">Delivery Status</th>
                <th className="p-2 border">Delivery Person</th>
                <th className="p-2 border">Assigned At</th>
                <th className="p-2 border">Order Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-sm">
                  {/* Order ID */}
                  <td className="p-2 border">{order.orderId}</td>

                  {/* Customer */}
                  <td className="p-2 border">{order.userId ? order.userId.name : "Customer"}</td>

                  {/* Delivery Address */}
                  <td className="p-2 border">{getDeliveryAddressStr(order.delivery_address)}</td>

                  {/* Product */}
                  <td className="p-2 border">{getProductNames(order)}</td>

                  {/* Total */}
                  <td className="p-2 border">{order.totalAmt ?? 0}</td>

                  {/* Payment status */}
                  <td className="p-2 border">{order.payment_status}</td>

                  {/* Order workflow status */}
                  <td className="p-2 border">{order.orderStatus}</td>

                  {/* Delivery person dropdown + display */}
                  <td className="p-2 border">
                    <select
                      value={order.delivery_person ? (order.delivery_person._id || order.delivery_person) : ""}
                      onChange={(e) => handleAssign(order.orderId, e.target.value)}
                      className="p-1 border rounded max-w-[220px]"
                      disabled={loadingAssign}
                    >
                      <option value="">-- Assign --</option>
                      {deliveryPersons.map((dp) => (
                        <option key={dp._id} value={dp._id}>
                          {dp.name} {dp.mobile ? `(${dp.mobile})` : `(${dp.email})`}
                        </option>
                      ))}
                    </select>

                    {/* display assigned name fallback */}
                    <div className="text-xs mt-1">
                      {order.delivery_person_name || (order.delivery_person && order.delivery_person.name) || "-"}
                    </div>
                  </td>

                  {/* Assigned At */}
                  <td className="p-2 border">
                    {order.assignedAt ? new Date(order.assignedAt).toLocaleString() : "-"}
                  </td>

                  {/* Order Date */}
                  <td className="p-2 border">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</td>

                  {/* Actions: Update Status & View Products */}
                  <td className="p-2 border flex gap-1">
                    <button
                      onClick={() =>
                        setConfirmBox({
                          open: true,
                          payload: { orderId: order.orderId, currentStatus: order.orderStatus },
                        })
                      }
                      className="text-xs px-2 py-1 border rounded bg-white hover:bg-gray-50"
                    >
                      Update Status
                    </button>

                    <button
                      onClick={() => openViewProducts(order)}
                      className="text-xs px-2 py-1 border rounded bg-white hover:bg-gray-50"
                    >
                      View Products
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={() => gotoPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <div className="px-3 py-1">
              Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
              <div className="text-xs text-gray-500">Total orders: {pagination.totalCount}</div>
            </div>

            <button
              onClick={() => gotoPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirm box to update status */}
      {confirmBox.open && (
        <CofirmBox
          close={() => setConfirmBox({ open: false, payload: null })}
          cancel={() => setConfirmBox({ open: false, payload: null })}
          confirm={async () => {
            // Simple UX: prompt new status (could be improved to select list)
            const newStatus = prompt("Enter new status", confirmBox.payload.currentStatus);
            if (newStatus && statusOptions.includes(newStatus)) {
              await handleUpdateStatus(confirmBox.payload.orderId, newStatus);
              setConfirmBox({ open: false, payload: null });
            } else {
              alert("Invalid status. Use one of: " + statusOptions.join(", "));
            }
          }}
        />
      )}

      {/* Products modal */}
      {selectedOrderForProducts && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white w-11/12 md:w-2/3 p-4 rounded shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Products in Order {selectedOrderForProducts.orderId}</h3>
              <button onClick={closeViewProducts} className="px-2">Close</button>
            </div>

            <div className="mt-4">
              <div><strong>Product Name:</strong> {selectedOrderForProducts.product_details?.name || selectedOrderForProducts.productId?.name}</div>

              <div className="mt-2">
                <strong>Images:</strong>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {(selectedOrderForProducts.product_details?.image || []).length === 0 && <div className="text-gray-500">No images</div>}
                  {(selectedOrderForProducts.product_details?.image || []).map((img, idx) => (
                    <img key={idx} src={img} alt="prod" className="w-24 h-24 object-cover border" />
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <strong>Snapshot fields:</strong>
                <pre className="text-xs bg-gray-100 p-2 rounded max-h-48 overflow-auto">{JSON.stringify(selectedOrderForProducts.product_details, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
