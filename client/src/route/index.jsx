//frontend routes
//client/src/route/index.jsx

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Profile from "../pages/Profile";
import Dashboard from "../layouts/Dashboard";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import DashBoardAdmin from "../pages/DashBoardAdmin";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import DeliverOrders from "../pages/DeliverOrders";
import AdminOrderPage from "../pages/adminOrderPage";
import DelvPermision from "../layouts/DelvPermision";
import UserPermision from "../layouts/UserPermision";
import UserMyOrders from "../pages/UserMyOrders";

const router = createBrowserRouter([
  {
    path: "/", //base url
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verification-otp",
        element: <OtpVerification />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "user",
        element: <UserMenuMobile />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },

          {
            path: "address",
            element: (
              <UserPermision>
                <Address />
              </UserPermision>
            ),
          },

          {
            path: "dashboardAdmin",
            element: (
              <AdminPermision>
                <DashBoardAdmin />
              </AdminPermision>
            ),
          },
          {
            path: "myorders",
            element: (
              <UserPermision>
                <UserMyOrders />
              </UserPermision>
            ),
          },

          {
            path: "admin-orders-management", // new unique path
            element: (
              <AdminPermision>
                <AdminOrderPage />
              </AdminPermision>
            ),
          },

          {
            path: "deliverOrders",
            element: (
              <DelvPermision>
                <DeliverOrders />
              </DelvPermision>
            ),
          },

          {
            path: "category",
            element: (
              <AdminPermision>
                <CategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "subcategory",
            element: (
              <AdminPermision>
                <SubCategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "upload-product", //category image uploading to cloudinary
            element: (
              <AdminPermision>
                <UploadProduct />
              </AdminPermision>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermision>
                <ProductAdmin />
              </AdminPermision>
            ),
          },
        ],
      },
      {
        path: ":category",
        children: [
          {
            path: ":subCategory",
            element: <ProductListPage />,
          },
        ],
      },
      {
        path: "product/:product",
        element: <ProductDisplayPage />,
      },
      {
        path: "cart",
        element: <CartMobile />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "cancel",
        element: <Cancel />,
      },
    ],
  },
]);

export default router;
