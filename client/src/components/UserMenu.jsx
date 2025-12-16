//client/src/components/UserMenu.jsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Divider from "./Divider";

import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

import {
  HiOutlineExternalLink,
  HiOutlineViewGrid,
  HiOutlineShoppingCart,
  HiOutlineMap,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from "react-icons/hi";

import { BiCloudUpload } from "react-icons/bi";
import { RiAlignItemBottomLine } from "react-icons/ri";
import {
  MdOutlineProductionQuantityLimits,
  MdManageHistory,
} from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { TbSitemap } from "react-icons/tb";

import isAdmin from "../utils/isAdmin";
import isDelv from "../utils/isDelv";
import isUser from "../utils/isUser";

const UserMenu = ({ close }) => {
  const { t } = useTranslation();
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
      <div className="font-semibold">{t("myAccount")}</div>

      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          <span className="italic text-xs text-green-600">
            {t("welcome")},
          </span>{" "}
          <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-md text-xs font-medium">
            {user.name || user.mobile}
          </span>{" "}
          <span className="text-medium text-red-600">
            {user.role === "ADMIN" ? `(${t("admin")})` : ""}
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

      {/* Menu Links */}
      <div className="text-sm grid gap-1">
        {/* Admin */}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/dashboardAdmin"}
            className="flex items-center gap-2 px-2 py-1"
          >
            <RiAlignItemBottomLine />
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              {t("dashboard")}
            </span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            to="/dashboard/admin-users"
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <FaUsersGear className="text-xl text-blue-500" />
            <span>{t("userManagement")}</span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineViewGrid className="text-gray-500" />
            <span>{t("category")}</span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/subcategory"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <TbSitemap className="text-gray-500" />
            <span>{t("subCategory")}</span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/upload-product"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <BiCloudUpload className="text-gray-500" />
            <span>{t("uploadProduct")}</span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/product"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <MdOutlineProductionQuantityLimits className="text-gray-500" />
            <span>{t("product")}</span>
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/admin-orders-management"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <MdManageHistory className="text-gray-500" />
            <span>{t("manageOrders")}</span>
          </Link>
        )}

        {/* Delivery */}
        {isDelv(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/deliverOrders"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineShoppingCart className="text-gray-500" />
            <span>{t("deliverOrders")}</span>
          </Link>
        )}

        {/* User */}
        {isUser(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/myorders"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineClipboardList className="text-gray-500" />
            <span>{t("myOrders")}</span>
          </Link>
        )}

        {isUser(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/address"}
            className="flex items-center gap-2 px-2 py-1 hover:bg-orange-200"
          >
            <HiOutlineMap className="text-gray-500" />
            <span>{t("saveAddress")}</span>
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-start px-2 hover:bg-orange-200 py-1"
        >
          <HiOutlineLogout className="text-gray-500" />
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
