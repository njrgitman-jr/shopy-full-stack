import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    product_details: {
      type: Object,
      required: true,
    },

    delivery_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },

    /** 
     * Order Status 
     * (do NOT use strict enums because it breaks if you add a new status later)
     */
    orderStatus: {
      type: String,
      default: "Processing",
    },

    /**
     * Payment Status 
     * Your DB already uses: "CASH ON DELIVERY"
     */
    payment_status: {
      type: String,
      default: "COD Pending",
    },

    /** 
     * Optional payment fields 
     */
    paymentId: { type: String, default: "" },
    invoice_receipt: { type: String, default: "" },

    subTotalAmt: { type: Number, default: 0 },
    totalAmt: { type: Number, default: 0 },

    /**
     * Delivery Person Information
     */
    delivery_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // You already store this in MongoDB, so keep it:
    delivery_person_name: { type: String, default: "" },

    assignedAt: { type: Date, default: null },
    expectedDeliveryDate: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
