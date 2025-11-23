// server/models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🧍 USER WHO PLACED THE ORDER
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📦 UNIQUE ORDER ID
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    // 📦 PRODUCT (later can become array)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    // 📄 PRODUCT SNAPSHOT
    product_details: {
      name: { type: String },
      image: { type: Array, default: [] },
    },

    // 💳 PAYMENT DETAILS
    paymentId: { type: String, default: "" },

    payment_status: {
      type: String,
      enum: ["COD Pending", "COD Paid", "COD Failed", "COD Refunded"],
      default: "COD Pending",
    },

    // 📍 DELIVERY ADDRESS
    delivery_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },

    // 💰 AMOUNTS
    subTotalAmt: { type: Number, default: 0 },
    totalAmt: { type: Number, default: 0 },

    invoice_receipt: { type: String, default: "" },

    // 🚚 DELIVERY PERSON
    delivery_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    delivery_person_name: {
      type: String,
      default: "",
    },

    // Assigned timestamp (new)
    assignedAt: {
      type: Date,
      default: null,
    },

    // 📊 ORDER STATUS WORKFLOW
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "ReadyForDispatch",
        "OutForDelivery",
        "Delivered",
        "FailedDelivery",
        "Returned",
        "Cancelled",
      ],
      default: "Pending",
    },

    expectedDeliveryDate: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true, // createdAt = order date, updatedAt = last update
  }
);

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
