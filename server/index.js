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

const app = express();

// =============================
// 🌍 ENVIRONMENT used in render for env. variable 
// =============================
const isProduction = process.env.NODE_ENV === "production";

// =============================
// 🌐 FLEXIBLE CORS (DEV + PROD)
// =============================
const allowedOrigins = [
  /^https:\/\/.*\.vercel\.app$/,       // Any Vercel frontend
  /^https:\/\/.*\.onrender\.com$/,     // Any Render frontend
  /^https:\/\/yourdomain\.com$/,       // Optional real domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🌍 Incoming Origin:", origin);

      // Allow Postman / backend-to-backend / serverless requests
      if (!origin) return callback(null, true);

      // Allow all localhost in dev
      if (!isProduction && /^http:\/\/localhost:\d+$/.test(origin)) {
        console.log("🟢 DEV MODE — Allowed:", origin);
        return callback(null, true);
      }

      // Production: only allow approved domains
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

// ========= START SERVER =========
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});




// // ====== SERVER ENTRY POINT ======
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();
// import cookieParser from "cookie-parser";
// import morgan from "morgan";
// import helmet from "helmet";
// import connectDB from "./config/connectDB.js";

// // ====== ROUTES ======
// import userRouter from "./route/user.route.js";
// import categoryRouter from "./route/category.route.js";
// import uploadRouter from "./route/upload.router.js";
// import subCategoryRouter from "./route/subCategory.route.js";
// import productRouter from "./route/product.route.js";
// import cartRouter from "./route/cart.route.js";
// import addressRouter from "./route/address.route.js";
// import orderRouter from "./route/order.route.js";
// import dashboardRouter from "./route/dashboard.route.js";
// import adminOrderRouter from "./route/admin-order.route.js";



// const app = express();

// // =============================
// // 🚀 UNIVERSAL FLEXIBLE CORS
// // (Local + Vercel Prod + Vercel Preview)
// // =============================
// const allowedOrigins = [
//   /^https:\/\/.*\.vercel\.app$/, // Any Vercel domain
//   /^http:\/\/localhost:\d+$/, // Any localhost (5173, 3000, 8080)
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       console.log("🌍 Incoming request from:", origin);

//       // Allow no-origin requests (Postman, cURL, mobile apps)
//       if (!origin) return callback(null, true);

//       const isAllowed = allowedOrigins.some((pattern) => pattern.test(origin));

//       if (isAllowed) {
//         console.log("✅ CORS Allowed:", origin);
//         callback(null, true);
//       } else {
//         console.log("❌ CORS BLOCKED:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // ========= MIDDLEWARES =========
// app.use(express.json());
// app.use(cookieParser());
// app.use(morgan("dev"));
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );

// // ========= PORT =========
// const PORT = process.env.PORT || 8080;

// // ========= TEST ROUTE =========
// app.get("/", (req, res) => {
//   res.json({
//     message: "Server is running on port " + PORT,
//   });
// });

// // ========= API ROUTES =========
// app.use("/api/user", userRouter);
// app.use("/api/category", categoryRouter);
// app.use("/api/file", uploadRouter);
// app.use("/api/subcategory", subCategoryRouter);
// app.use("/api/product", productRouter);
// app.use("/api/cart", cartRouter);
// app.use("/api/address", addressRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/dashboard", dashboardRouter);
// app.use("/api/admin-orders", adminOrderRouter);


// // ========= START SERVER =========
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("🚀 Server is running on port", PORT);
//   });
// });
