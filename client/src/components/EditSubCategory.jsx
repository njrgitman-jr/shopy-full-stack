import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const EditSubCategory = ({ close, data, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name || "",
    image: data.image || "",
    category: data.category || [],
  });

  const [loading, setLoading] = useState(false);
  const allCategory = useSelector((state) => state.product.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;

      setSubCategoryData((prev) => ({
        ...prev,
        image: ImageResponse.data.url,
      }));
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat._id !== categoryId),
    }));
  };

  const handleSelectCategory = (e) => {
    const value = e.target.value;
    if (!value) return;

    const categoryDetails = allCategory.find((cat) => cat._id === value);
    if (!categoryDetails) return;

    const alreadySelected = subCategoryData.category.some(
      (cat) => cat._id === value
    );
    if (alreadySelected) return;

    setSubCategoryData((prev) => ({
      ...prev,
      category: [...prev.category, categoryDetails],
    }));

    e.target.value = ""; // Reset dropdown
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();

    if (
      !subCategoryData.name ||
      !subCategoryData.image ||
      subCategoryData.category.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateSubCategory,
        data: subCategoryData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        close && close();
        fetchData && fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    subCategoryData.name &&
    subCategoryData.image &&
    subCategoryData.category.length > 0;

  const availableCategories = allCategory.filter(
    (cat) => !subCategoryData.category.some((sel) => sel._id === cat._id)
  );

  return (
    <section className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white p-4 rounded shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold text-lg">Edit Sub Category</h1>
          <button onClick={close} className="text-gray-600 hover:text-black">
            <IoClose size={25} />
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmitSubCategory}>
          {/* Name Input */}
          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              placeholder="Sub-category name"
              className="p-3 bg-blue-50 border outline-none focus:border-primary-200 rounded"
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Image</label>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center rounded overflow-hidden">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="subCategory"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-400">No Image</p>
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div
                  className={`px-4 py-2 rounded border font-medium cursor-pointer transition 
                  ${
                    loading
                      ? "bg-gray-200 text-gray-400"
                      : "border-primary-200 hover:bg-primary-100"
                  }`}
                >
                  {loading ? "Uploading..." : "Upload Image"}
                </div>
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  className="hidden"
                  disabled={loading}
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
          </div>

          {/* Category Selector */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Select Category</label>
            <div className="border rounded p-2">
              {/* Selected Categories */}
              <div className="flex flex-wrap gap-2 mb-2">
                {subCategoryData.category.map((cat) => (
                  <p
                    key={cat._id}
                    className="bg-white shadow-md px-2 py-1 flex items-center gap-2 rounded"
                  >
                    {cat.name}
                    <IoClose
                      size={18}
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => handleRemoveCategorySelected(cat._id)}
                    />
                  </p>
                ))}
              </div>

              {/* Category Dropdown */}
              <select
                className="w-full p-2 bg-transparent outline-none border"
                onChange={handleSelectCategory}
              >
                <option value="">Select Category</option>
                {availableCategories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
             className={`px-4 py-2 border font-semibold
              ${
                isFormValid
                  ? "bg-primary-200 hover:bg-primary-100 cursor-pointer"
                  : "bg-gray-200 cursor-not-allowed"
              }
            `}
          >
            {loading ? "Updating..." : "Update Sub Category"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;
