// client/src/pages/adminOrderPage.jsx
import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";

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

  // small fetch wrapper to include credentials
  const callApi = async ({ url, method = "get", body }) => {
    const opts = {
      method: method.toUpperCase(),
      headers: {},
      credentials: "include",
    };
    if (body) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
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
      const url = `${SummaryApi.adminOrderList.url}?${qp.toString()}`;
      const data = await callApi({ url, method: "get" });
      if (data.success) {
        setOrders(data.data || []);
        setPagesTotal(data.pagination?.pages || 1);
        setPage(data.pagination?.page || p);
      } else {
        console.error("Failed to fetch orders", data);
      }
    } catch (err) {
      console.error("loadOrders err", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveryPersons = async () => {
    try {
      const data = await callApi({ url: SummaryApi.adminGetDeliveryPersons.url, method: "get" });
      if (data.success) setDeliveryPersons(data.data || []);
    } catch (err) {
      console.error("loadDeliveryPersons", err);
    }
  };

  useEffect(() => {
    loadOrders(1);
    loadDeliveryPersons();
    // eslint-disable-next-line
  }, [limit]);

  // search trigger
  const doSearch = async () => {
    setPage(1);
    await loadOrders(1);
  };

  const changeStatus = async (orderId, status) => {
    try {
      const data = await callApi({
        url: SummaryApi.adminUpdateOrderStatus.url,
        method: "put",
        body: { orderId, status },
      });
      if (data.success) {
        await loadOrders(page);
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("changeStatus err", err);
    }
  };

  const openAssign = (order) => {
    setSelectedOrderForAssign(order);
    setSelectedDeliveryPerson(order?.delivery_person?._id || "");
  };

  const doAssignDelivery = async () => {
    if (!selectedOrderForAssign || !selectedDeliveryPerson) {
      alert("Select delivery person");
      return;
    }
    try {
      const data = await callApi({
        url: SummaryApi.adminAssignDelivery.url,
        method: "put",
        body: { orderId: selectedOrderForAssign.orderId, deliveryPersonId: selectedDeliveryPerson },
      });
      if (data.success) {
        setSelectedOrderForAssign(null);
        await loadOrders(page);
      } else {
        alert(data.message || "Failed to assign");
      }
    } catch (err) {
      console.error("doAssignDelivery", err);
    }
  };

  // mobile card rendering
  const OrderCard = ({ o }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">Order ID</div>
          <div className="font-medium">{o.orderId}</div>
          <div className="text-sm text-gray-500 mt-2">User</div>
          <div className="text-sm">{o.user?.email || "-"}</div>
          <div className="text-sm text-gray-500 mt-2">Product</div>
          <div className="text-sm">{o.product_details?.name || "-"}</div>
          <div className="text-sm text-gray-500 mt-2">Amount</div>
          <div className="font-semibold">${o.totalAmt?.toFixed?.(2) ?? o.totalAmt}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Status</div>
          <div className="mb-2">
            <select
              value={o.orderStatus}
              onChange={(e) => changeStatus(o.orderId, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s || "—"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={() => openAssign(o)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-400">Created: {new Date(o.createdAt).toLocaleString()}</div>
      <div className="mt-1 text-xs text-gray-400">Assigned to: {o.delivery_person_name || "—"}</div>
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin — Orders</h1>

      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="flex-1 mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search by order ID or user email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2"
            onKeyDown={(e)=> { if(e.key === 'Enter') doSearch(); }}
          />
        </div>

        <div className="space-x-2 flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border rounded px-2 py-2"
          >
            <option value="">All statuses</option>
            {statusOptions.map((s) => s && <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={limit} onChange={(e)=> { setLimit(parseInt(e.target.value)); }} className="border rounded px-2 py-2">
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>

          <button onClick={doSearch} className="bg-gray-800 text-white px-3 py-2 rounded">Search</button>
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Delivery Person</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b">
                    <td className="p-3">{o.orderId}</td>
                    <td className="p-3">{o.user?.email || "-"}</td>
                    <td className="p-3">{o.product_details?.name || "-"}</td>
                    <td className="p-3">${o.totalAmt?.toFixed?.(2) ?? o.totalAmt}</td>
                    <td className="p-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => changeStatus(o.orderId, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s || "—"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">{o.delivery_person_name || "-"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => openAssign(o)} className="px-2 py-1 bg-blue-600 text-white rounded">Assign</button>
                        <button onClick={() => window.open(`/admin/order/${o.orderId}`, "_blank")} className="px-2 py-1 border rounded">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden">
            {orders.map((o) => <OrderCard key={o._id} o={o} />)}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          Page {page} of {pagesTotal} — Total per page {limit}
        </div>
        <div className="flex gap-2 items-center">
          <button disabled={page <= 1} onClick={() => { setPage(1); loadOrders(1); }} className="px-3 py-1 border rounded disabled:opacity-50">First</button>
          <button disabled={page <= 1} onClick={() => { const np = Math.max(1, page-1); setPage(np); loadOrders(np); }} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <button disabled={page >= pagesTotal} onClick={() => { const np = Math.min(pagesTotal, page+1); setPage(np); loadOrders(np); }} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          <button disabled={page >= pagesTotal} onClick={() => { setPage(pagesTotal); loadOrders(pagesTotal); }} className="px-3 py-1 border rounded disabled:opacity-50">Last</button>
        </div>
      </div>

      {/* Assign modal simple panel */}
      {selectedOrderForAssign && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40" onClick={()=>setSelectedOrderForAssign(null)} />
          <div className="relative bg-white rounded-t-lg md:rounded-lg p-4 w-full md:w-1/2 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Assign Delivery — {selectedOrderForAssign.orderId}</h3>
              <button onClick={()=>setSelectedOrderForAssign(null)} className="text-gray-500">Close</button>
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Select Delivery Person</label>
              <select value={selectedDeliveryPerson} onChange={(e)=>setSelectedDeliveryPerson(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">-- Select --</option>
                {deliveryPersons.map(dp => (<option key={dp._id} value={dp._id}>{dp.name} — {dp.email}</option>))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={()=>setSelectedOrderForAssign(null)} className="px-3 py-2 border rounded">Cancel</button>
              <button onClick={doAssignDelivery} className="px-3 py-2 bg-blue-600 text-white rounded">Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
