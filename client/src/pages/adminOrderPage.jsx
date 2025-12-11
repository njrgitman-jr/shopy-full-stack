// adminOrderPage.jsx
// FULL UPDATED AdminOrderPage.jsx with View Items Modal
// Mobile & Desktop friendly, responsive, scrollable, striped table, 3-decimal amounts

import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const defaultLimit = 10;

const statusOptions = [
  "",
  "Pending",
  "Processing",
  "ReadyForDispatch",
  "OutForDelivery",
  "Delivered",
  "FailedDelivery",
  "Returned",
  "Cancelled",
];

function Loader() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesTotal, setPagesTotal] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);

  const [viewItemsOrder, setViewItemsOrder] = useState(null);

  const callApi = async ({ url, method = "get", body }) => {
    const opts = {
      method: method.toUpperCase(),
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    };
    const res = await fetch(url, opts);
    return res.json();
  };

  const loadOrders = async (p = page) => {
    setLoading(true);
    try {
      const qp = new URLSearchParams({
        page: p,
        limit,
        search,
        status: statusFilter,
      });
      const data = await callApi({
        url: `${SummaryApi.adminOrderList.url}?${qp.toString()}`,
      });
      if (data.success) {
        setOrders(data.data || []);
        setPagesTotal(data.pagination?.pages || 1);
        setPage(data.pagination?.page || p);
        setTotalOrders(data.pagination?.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveryPersons = async () => {
    const data = await callApi({ url: SummaryApi.adminGetDeliveryPersons.url });
    if (data.success) setDeliveryPersons(data.data || []);
  };

  useEffect(() => {
    loadOrders(1);
    loadDeliveryPersons();
  }, [limit]);

  const doSearch = () => loadOrders(1);

  const changeStatus = async (orderId, status) => {
    const data = await callApi({
      url: SummaryApi.adminUpdateOrderStatus.url,
      method: "put",
      body: { orderId, status },
    });
    if (data.success) loadOrders(page);
  };

  const openAssign = (order) => {
    setSelectedOrderForAssign(order);
    setSelectedDeliveryPerson(order?.delivery_person?._id || "");
  };

  const doAssignDelivery = async () => {
    if (!selectedDeliveryPerson) return toast.error("Select delivery person");
    if (!selectedOrderForAssign || !selectedOrderForAssign.orderId)
      return toast.error("Order ID missing. Refresh page.");
    const data = await callApi({
      url: SummaryApi.adminAssignDelivery.url,
      method: "put",
      body: {
        orderId: selectedOrderForAssign.orderId,
        deliveryPersonId: selectedDeliveryPerson,
      },
    });
    if (data.success) {
      toast.success("Delivery assigned!");
      setSelectedOrderForAssign(null);
      loadOrders(page);
    } else {
      toast.error(data.message || "Failed to assign delivery");
    }
  };

  return (
    <div className="p-4 w-full max-w-[100%] mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin — Orders</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="border rounded px-3 py-2 w-full text-sm"
          placeholder="Search order ID or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1 w-full text-sm"
        >
          <option value="">All statuses</option>
          {statusOptions.map((s) => s && <option key={s}>{s}</option>)}
        </select>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border rounded px-2 py-1 w-full text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <button
          onClick={doSearch}
          className="bg-gray-800 text-white px-4 py-2 rounded w-full text-sm"
        >
          Search
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Order Date</th>
                  <th className="p-2 text-left">Assigned At</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Delivery Person</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((o, idx) => (
                  <tr key={o._id} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="p-2">{o.orderId}</td>
                    <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="p-2">{o.assignedAt ? new Date(o.assignedAt).toLocaleString() : "-"}</td>
                    <td className="p-2">${Number(o.totalAmt).toFixed(3)}</td>
                    <td className="p-2">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => changeStatus(o.orderId, e.target.value)}
                        className="border rounded px-2 py-1 text-xs w-full"
                      >
                        {statusOptions.map((s) => (
                          <option key={s}>{s || "—"}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">{o.delivery_person_name || "-"}</td>
                    <td className="p-2 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === o._id ? null : o._id)}
                        className="p-1 rounded hover:bg-gray-200 text-sm"
                      >
                        ⋮
                      </button>

                      {openMenu === o._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow rounded z-20 text-sm">
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              openAssign(o);
                            }}
                            className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              setViewItemsOrder(o);
                            }}
                            className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                          >
                            View Items
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map((o) => (
              <div key={o._id} className="bg-white rounded shadow p-3 text-sm space-y-1 relative w-full">
                <div className="flex justify-between items-start relative text-sm">
                  <span className="font-semibold">{o.orderId}</span>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === o._id ? null : o._id)}
                      className="p-1 text-lg"
                    >
                      ⋮
                    </button>
                    {openMenu === o._id && (
                      <div className="absolute right-0 top-7 w-32 bg-white border rounded shadow z-30 text-sm">
                        <button
                          onClick={() => {
                            setOpenMenu(null);
                            openAssign(o);
                          }}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => {
                            setOpenMenu(null);
                            setViewItemsOrder(o);
                          }}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                        >
                          View Items
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs"><b>Order Date:</b> {new Date(o.createdAt).toLocaleString()}</p>
                <p className="text-xs"><b>Assigned At:</b> {o.assignedAt ? new Date(o.assignedAt).toLocaleString() : "-"}</p>
                <p className="text-xs"><b>Amount:</b> ${Number(o.totalAmt).toFixed(3)}</p>

                <div className="text-xs">
                  <b>Status:</b>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => changeStatus(o.orderId, e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1 text-xs"
                  >
                    {statusOptions.map((s) => (
                      <option key={s}>{s || "—"}</option>
                    ))}
                  </select>
                </div>

                <p className="text-xs"><b>Delivery Person:</b> {o.delivery_person_name || "-"}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TOTAL */}
      <div className="text-sm text-gray-600 mt-2">
        Showing {(page - 1) * limit + 1}–{(page - 1) * limit + orders.length} of {totalOrders} orders
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-between text-sm flex-wrap gap-2">
        <div>Page {page} / {pagesTotal}</div>
        <div className="flex gap-2 flex-wrap">
          <button disabled={page <= 1} onClick={() => loadOrders(1)} className="px-3 py-1 border rounded text-sm">First</button>
          <button disabled={page <= 1} onClick={() => loadOrders(page - 1)} className="px-3 py-1 border rounded text-sm">Prev</button>
          <button disabled={page >= pagesTotal} onClick={() => loadOrders(page + 1)} className="px-3 py-1 border rounded text-sm">Next</button>
          <button disabled={page >= pagesTotal} onClick={() => loadOrders(pagesTotal)} className="px-3 py-1 border rounded text-sm">Last</button>
        </div>
      </div>

      {/* ASSIGN MODAL */}
      {selectedOrderForAssign && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setSelectedOrderForAssign(null)} />
          <div className="relative bg-white rounded p-4 w-full max-w-[95%] md:w-1/2 max-h-[90vh] overflow-auto text-sm">
            <h3 className="text-lg font-semibold mb-3">Assign Delivery — {selectedOrderForAssign.orderId}</h3>
            <select
              value={selectedDeliveryPerson}
              onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
              className="w-full border rounded px-3 py-1 mb-3 text-sm"
            >
              <option value="">-- Select Person --</option>
              {deliveryPersons.map((d) => (
                <option key={d._id} value={d._id}>{d.name} — {d.email}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedOrderForAssign(null)} className="px-3 py-1 border rounded text-sm">Cancel</button>
              <button onClick={doAssignDelivery} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Assign</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ITEMS MODAL */}
      {viewItemsOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setViewItemsOrder(null)}
          />
          <div className="relative bg-white w-full max-w-[95%] md:w-2/3 rounded p-4 max-h-[90vh] overflow-y-auto text-sm">
            <h2 className="text-xl font-semibold mb-3">Order Items — {viewItemsOrder.orderId}</h2>
            <div className="space-y-4">
              {viewItemsOrder.items?.map((item, index) => (
                <div key={index} className="border rounded p-2 flex gap-2">
                  <div className="flex gap-2 overflow-x-auto max-w-[120px]">
                    {Array.isArray(item.product_details?.image) &&
                      item.product_details.image.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded" />
                      ))}
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold">{item.product_details?.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p className="font-semibold text-gray-700">Price: ${Number(item.product_details?.price || 0).toFixed(3)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right mt-4">
              <button onClick={() => setViewItemsOrder(null)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
