//client/src/pages/login.jsx
import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

// ✅ Language Switcher
import LanguageSwitcher from "../components/LanguageSwitcher";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();
  const sessionExpired = new URLSearchParams(location.search).get(
    "sessionExpired"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validValue = Object.values(data).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // ✅ Internet / Network check BEFORE request
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your network.");
      return;
    }

    setLoading(true);

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data,
      });

      if (response.data?.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data?.success) {
        toast.success(response.data.message);

        localStorage.setItem("accesstoken", response.data.data.accesstoken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({ email: "", password: "" });
        navigate("/", { replace: true });
      }
    } catch (error) {
      /**
       * ✅ ERROR HANDLING PRIORITY
       * 1. No server response → Network / Server down
       * 2. DB disconnected → backend 500 with message
       * 3. Other errors
       */

      if (!error.response) {
        toast.error(
          "Unable to reach server. Please check your internet connection."
        );
      } else if (
        error.response.status === 500 &&
        error.response.data?.message?.toLowerCase().includes("database")
      ) {
        toast.error(
          "Database is currently unavailable. Please try again later."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      {/* 🌍 Language Switcher */}
      <div className="flex justify-end mt-3">
        <LanguageSwitcher />
      </div>

      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        {/* Session expired message */}
        {sessionExpired && (
          <p className="text-red-600 font-bold mb-2">
            Session expired... please login again
          </p>
        )}

        <p className="font-semibold mb-2">
          Login to Shopyit (Preview 2)
        </p>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="password">Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>

            <Link
              to={"/forgot-password"}
              className="block ms-auto hover:text-primary-200"
            >
              Forgot password ?
            </Link>
          </div>

          <button
            disabled={!validValue || loading}
            className={`${
              validValue
                ? "bg-green-800 hover:bg-green-700"
                : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have account?{" "}
          <Link
            to={"/register"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
