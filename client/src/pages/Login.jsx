// client/src/pages/login.jsx
import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

// 🌍 i18n
import i18n from "../i18n";

// ✅ Language Switcher
import LanguageSwitcher from "../components/LanguageSwitcher";

// ✅ Google Login
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
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

  // 🌟 Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your network.");
      return;
    }

    setLoading(true);

    try {
      const response = await Axios({ ...SummaryApi.login, data });

      if (response.data?.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data?.success) {
        toast.success(response.data.message);

        // 🔐 Save tokens
        localStorage.setItem("accesstoken", response.data.data.accesstoken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        // 🌍 Save language
        const language = response.data.data.language || "en";
        localStorage.setItem("language", language);
        i18n.changeLanguage(language);

        // 👤 Fetch user details
        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({ email: "", password: "" });
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Google Login
const handleGoogleLogin = async (res) => {
  try {
    if (!res || !res.credential) {
      toast.error("Google credential not received. Check client ID & origin.");
      return;
    }

    const response = await Axios({
      ...SummaryApi.googleLogin,
      data: { credential: res.credential },
    });

    if (!response.data?.success) {
      toast.error(response.data.message || "Google login failed");
      return;
    }

    localStorage.setItem("accesstoken", response.data.data.accesstoken);
    localStorage.setItem("refreshToken", response.data.data.refreshToken);
    localStorage.setItem("language", response.data.data.language || "en");
    i18n.changeLanguage(response.data.data.language || "en");

    const user = await fetchUserDetails();
    dispatch(setUserDetails(user.data));

    toast.success("Logged in with Google");
    navigate("/", { replace: true });
  } catch (err) {
    console.error("Google login error:", err.response?.data || err);
    toast.error(err.response?.data?.message || "Google login failed");
  }
};



  return (
    <section className="w-full container mx-auto px-2">
      {/* 🌍 Language Switcher */}
      <div className="flex justify-end mt-3">
        <LanguageSwitcher />
      </div>

      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        {sessionExpired && (
          <p className="text-red-600 font-bold mb-2">
            Session expired... please login again
          </p>
        )}

        <p className="font-semibold mb-2">Login to Shopyit (Preview 2)</p>

        {/* 🔐 Email / Password Login */}
        <form
          className="grid gap-4 py-4"
          onSubmit={handleSubmit}
        >
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
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-0 tracking-wide`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* 🔵 Google Login */}
        <div className="flex justify-center my-0">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed")}
          />
        </div>

        <p className="text-center">
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
