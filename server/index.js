// ====== SERVER ENTRY POINT ======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";

// ====== ROUTES ======
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import addressRouter from "./route/address.route.js";
import orderRouter from "./route/order.route.js";
import dashboardRouter from "./route/dashboard.route.js";
import adminOrderRouter from "./route/admin-order.route.js";
import deliveryOrderRouter from "./route/delivery-order.route.js";
import myOrdersRouter from "./route/my-orders.route.js";



const app = express();

// =============================
// 🌍 ENVIRONMENT used in render for env. variable 
// =============================
const isProduction = process.env.NODE_ENV === "production";

// =============================
// 🌐 FLEXIBLE CORS (DEV + PROD)
// =============================
const allowedOrigins = [
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.onrender\.com$/,
  /^https:\/\/yourdomain\.com$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🌍 Incoming Origin:", origin);

      if (!origin) return callback(null, true);

      if (!isProduction && /^http:\/\/localhost:\d+$/.test(origin)) {
        console.log("🟢 DEV MODE — Allowed:", origin);
        return callback(null, true);
      }

      const allowed = allowedOrigins.some((rule) => rule.test(origin));

      if (allowed) {
        console.log("🟢 PROD — Allowed:", origin);
        callback(null, true);
      } else {
        console.log("🔴 BLOCKED BY CORS:", origin);
        callback(new Error("CORS Not Allowed: " + origin));
      }
    },
    credentials: true,
  })
);

// =============================
// ⭐ REQUIRED FIX #1 — CREDENTIAL HEADERS
// =============================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // mirror back the origin only if allowed
  if (
    (!isProduction && /^http:\/\/localhost:\d+$/.test(origin)) ||
    allowedOrigins.some((rule) => rule.test(origin))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ========= MIDDLEWARES =========
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ========= PORT =========
const PORT = process.env.PORT || 8080;

// ========= TEST ROUTE =========
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API running on port " + PORT,
    environment: isProduction ? "production" : "development",
  });
});

// ========= API ROUTES =========
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/admin-orders", adminOrderRouter);
app.use("/api/delivery-orders", deliveryOrderRouter);
app.use("/api/my-orders", myOrdersRouter);

// ========= START SERVER =========
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
