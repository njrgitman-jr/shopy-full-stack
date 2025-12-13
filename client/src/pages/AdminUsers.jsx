import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const ROLE_OPTIONS = ["USER", "ADMIN", "DELV"];
const STATUS_OPTIONS = ["Active", "Inactive", "Suspended"];

const AdminUsers = () => {
  const currentUser = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await Axios({ ...SummaryApi.adminUserList });
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId, role) => {
    try {
      await Axios({
        ...SummaryApi.adminChangeUserRole,
        data: { userId, role },
      });
      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const changeStatus = async (userId, status) => {
    try {
      await Axios({
        ...SummaryApi.adminChangeUserStatus,
        data: { userId, status },
      });
      toast.success("Status updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Admin – User Management</h1>

     {/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full border text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="border px-3 py-2 text-left">Name</th>
        <th className="border px-3 py-2">Email</th>
        <th className="border px-3 py-2">Role</th>
        <th className="border px-3 py-2">Status</th>
        <th className="border px-3 py-2">Last Login</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={5} className="text-center py-10">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              {/* <span className="text-gray-500 font-medium">Loading users...</span> */}
            </div>
          </td>
        </tr>
      ) : (
        users.map((u) => (
          <tr key={u._id} className="hover:bg-gray-50">
            <td className="border px-3 py-2">{u.name}</td>
            <td className="border px-3 py-2">{u.email}</td>
            <td className="border px-3 py-2">
              <select
                disabled={u._id === currentUser._id}
                value={u.role}
                onChange={(e) => changeRole(u._id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </td>
            <td className="border px-3 py-2">
              <select
                value={u.status}
                onChange={(e) => changeStatus(u._id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </td>
            <td className="border px-3 py-2">
              {u.last_login_date
                ? new Date(u.last_login_date).toLocaleString()
                : "—"}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 text-xs">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="border-2 rounded-lg shadow-md p-2 animate-pulse bg-gray-100 h-24"
                ></div>
              ))
          : users.map((u, index) => (
              <div
                key={u._id}
                className={`border-2 rounded-lg shadow-md p-2 ${
                  index % 2 === 0
                    ? "bg-blue-50 border-blue-400"
                    : "bg-indigo-50 border-indigo-400"
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Name:</span>
                  <span>{u.name}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Email:</span>
                  <span>{u.email}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Role:</span>
                  <select
                    disabled={u._id === currentUser._id}
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border rounded px-1 py-0.5 text-xs w-24"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Status:</span>
                  <select
                    value={u.status}
                    onChange={(e) => changeStatus(u._id, e.target.value)}
                    className="border rounded px-1 py-0.5 text-xs w-24"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Last Login:</span>
                  <span>
                    {u.last_login_date
                      ? new Date(u.last_login_date).toLocaleString()
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default AdminUsers;
