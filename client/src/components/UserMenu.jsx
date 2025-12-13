//new nothing change test for deploy
//client/src/components/UserMenu.jsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import {
  HiOutlineExternalLink,
  HiOutlineChartPie, // Analytics icon for Dashboard
  HiOutlineViewGrid, // Dashboard icon for Category
  HiOutlineCollection,
  HiOutlineShoppingCart,
  HiOutlineMap,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineUsers
} from "react-icons/hi";
import isAdmin from "../utils/isAdmin";
import isDelv from "../utils/isDelv";
import isUser from "../utils/isUser";


const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  return (
    <div>
      {/* User Info Header */}
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          <span className="italic text-xs text-green-600">Welcome,</span>{" "}
          <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-md text-xs font-medium">
            {user.name || user.mobile}
          </span>{" "}
          <span className="text-medium text-red-600">
            {user.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className="hover:text-primary-200"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      {/* Menu Links Section */}
      <div className="text-sm grid gap-1">
        {/* Admin Links */}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/dashboardAdmin"}
            className="flex items-center gap-2 px-2 py-1"
          >
            <HiOutlineChartPie className="text-gray-500" />
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Dashboard
            </span>
          </Link>
        )}




        {isAdmin(user.role) && (
          <Link
            to="/dashboard/admin-users"
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineUsers className="text-xl text-blue-500" />
            <span>User Management</span>
          </Link>
        )}






        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineViewGrid className="text-gray-500" />{" "}
            <span>Category</span>
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/subcategory"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineCollection className="text-gray-500" />{" "}
            <span>Sub Category</span>
          </Link>
        )}


 {isAdmin(user.role) && (
  <Link
    onClick={handleClose}
    to={"/dashboard/upload-product"}
    className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
  >
    <HiOutlineShoppingCart className="text-gray-500" />
    <span>Upload Product</span>
  </Link>
)}



        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/product"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineShoppingCart className="text-gray-500" />{" "}
            <span>Product</span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/admin-orders-management"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineShoppingCart className="text-gray-500" />{" "}
            <span>Manage Orders</span>
          </Link>
        )}

        {isDelv(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/deliverOrders"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineShoppingCart className="text-gray-500" />{" "}
            <span>Deliver Orders</span>
          </Link>
        )}

        {/* Regular User Links */}
        {isUser(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/myorders"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineClipboardList className="text-gray-500" />{" "}
            <span>My Orders</span>
          </Link>
        )}

        {isUser(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/address"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineMap className="text-gray-500" /> <span>Save Address</span>
          </Link>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-left px-2 hover:bg-orange-200 py-1"
        >
          <HiOutlineLogout className="text-gray-500" /> <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
