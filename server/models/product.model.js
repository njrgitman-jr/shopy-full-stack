//3.36 to 1:17

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: Array,
      default: [],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "category",
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      defualt: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    more_details: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "products", // ← Explicitly set collection name in mogodb
  }
);

// ✅ Define a text index on desired fields
// MongoDB will consider matches in description slightly more important than matches in name
productSchema.index(
  {
    name: "text",
    description: "text",
  },
  {
    weights: {
      name: 4,
      description: 5,
    },
  }
);

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;
