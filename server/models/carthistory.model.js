// carthistory.model.js
import mongoose from "mongoose";

const cartHistorySchema = new mongoose.Schema(
  {
    // reference to the Order document _id (the created order)
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order", // refer to the order model name defined in order.model.js
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CartHistoryModel = mongoose.model("CartHistory", cartHistorySchema);
export default CartHistoryModel;
