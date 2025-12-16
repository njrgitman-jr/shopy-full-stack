import React from "react";
import { IoClose } from "react-icons/io5";

const ViewImage = ({ url, close, name, category = [], subCategory = [] }) => {
  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-md max-h-[90vh] p-4 bg-white rounded-md shadow-lg overflow-y-auto">
        {/* 🔘 Close button */}
        <button
          onClick={close}
          className="w-fit ms-auto block mb-3 text-gray-600 hover:text-black"
        >
          <IoClose size={25} />
        </button>

        {/* 🖼️ Product image */}
        <img
          src={url}
          alt={name || "product"}
          className="w-full h-64 object-contain border rounded-md"
        />

        {/* 📋 Product details */}
        <div className="mt-4 text-gray-700 space-y-2">
          {/* Product name */}
          {name && (
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          )}

          {/* Category */}
          {category?.length > 0 && (
            <p className="text-sm">
              <span className="font-semibold">Category:</span>{" "}
              {category.map((cat) => cat?.name || "Unnamed").join(", ")}
            </p>
          )}

          {/* Subcategory */}
          {subCategory?.length > 0 && (
            <p className="text-sm">
              <span className="font-semibold">Subcategory:</span>{" "}
              {subCategory.map((sub) => sub?.name || "Unnamed").join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
