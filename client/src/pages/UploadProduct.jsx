import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Select from "react-select";
import { useSelector } from "react-redux";

import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";

const UploadProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  /** ------------------ HANDLERS ------------------ **/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setImageLoading(true);
      const response = await uploadImage(file);
      const imageUrl = response?.data?.data?.url;
      setData((prev) => ({ ...prev, image: [...prev.image, imageUrl] }));
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const updated = [...data.image];
    updated.splice(index, 1);
    setData((prev) => ({ ...prev, image: updated }));
  };

  const handleAddCategory = (e) => {
    const value = e.target.value;
    const category = allCategory.find((el) => el._id === value);
    if (category) {
      setData((prev) => ({
        ...prev,
        category: [...prev.category, category],
      }));
    }
  };

  const handleRemoveCategory = (index) => {
    const updated = [...data.category];
    updated.splice(index, 1);
    setData((prev) => ({ ...prev, category: updated }));
  };

  const handleRemoveSubCategory = (index) => {
    const updated = [...data.subCategory];
    updated.splice(index, 1);
    setData((prev) => ({ ...prev, subCategory: updated }));
  };

  const handleAddField = () => {
    if (!fieldName.trim()) return;
    setData((prev) => ({
      ...prev,
      more_details: { ...prev.more_details, [fieldName]: "" },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prevent multiple submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await Axios({ ...SummaryApi.createProduct, data });
      const { data: res } = response;
      if (res.success) {
        successAlert(res.message);
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** ------------------ REACT-SELECT CONFIG ------------------ **/
  const subCategoryOptions = allSubCategory
    .filter((s) => !data.subCategory.find((sel) => sel._id === s._id))
    .map((s) => ({
      value: s._id,
      label: s.name,
      image: s.image, // assuming each subcategory has an image property
    }));

  const customSubCategoryOption = ({ innerRef, innerProps, data }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-2 p-2 hover:bg-blue-100 cursor-pointer"
    >
      <img
        src={data.image}
        alt={data.label}
        className="w-6 h-6 object-cover rounded"
      />
      <span>{data.label}</span>
    </div>
  );

  const customSubCategorySingleValue = ({ data }) => (
    <div className="flex items-center gap-2">
      <img
        src={data.image}
        alt={data.label}
        className="w-5 h-5 object-cover rounded"
      />
      <span>{data.label}</span>
    </div>
  );

  /** ------------------ JSX ------------------ **/
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Product</h2>
      </div>

      <div className="grid p-3">
        <form
          className="grid gap-4"
          onSubmit={handleSubmit}
        >
          {/* Product Name */}
          <div className="grid gap-1">
            <label
              htmlFor="name"
              className="font-medium"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200"
            />
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <label
              htmlFor="description"
              className="font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
              rows={3}
              className="bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200 resize-none"
            />
          </div>

          {/* Upload Images */}
          <div className="grid gap-1">
            <p className="font-medium">Images</p>
            <label
              htmlFor="productImage"
              onClick={(e) => imageLoading && e.preventDefault()} // 🛑 Prevent clicking while uploading
              className={`bg-blue-50 h-24 border rounded flex justify-center items-center transition-all duration-200 ${
                imageLoading
                  ? "opacity-60 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer hover:bg-blue-100"
              }`}
            >
              <div className="text-center flex flex-col items-center">
                {imageLoading ? (
                  <>
                    <Loading /> {/* 👀 show loader while uploading */}
                    {/* <p className="text-sm text-gray-600 mt-0">Uploading...</p> */}
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt
                      size={35}
                      className="text-blue-500"
                    />
                    <p className="text-gray-700">Upload Image</p>
                  </>
                )}
              </div>

              <input
                type="file"
                id="productImage"
                className="hidden"
                accept="image/*"
                onChange={handleUploadImage}
                disabled={imageLoading} // 🔒 disable while uploading
              />
            </label>

            {/* Drag & Drop Images */}
            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return;
                const reordered = Array.from(data.image);
                const [removed] = reordered.splice(result.source.index, 1);
                reordered.splice(result.destination.index, 0, removed);
                setData((prev) => ({ ...prev, image: reordered }));
              }}
            >
              <Droppable
                droppableId="images"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {data.image.map((img, index) => (
                      <Draggable
                        key={img + index}
                        draggableId={img + index}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="h-20 w-20 bg-blue-50 border relative group"
                          >
                            <img
                              src={img}
                              alt={img}
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() => setViewImageURL(img)}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(index)}
                              className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded text-white hidden group-hover:block"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* CATEGORY */}
          <div className="grid gap-1">
            <label className="font-medium">Category</label>
            <Select
              options={allCategory
                .filter(
                  (c) =>
                    !data.category.find((selected) => selected._id === c._id)
                )
                .map((c) => ({
                  value: c._id,
                  label: c.name,
                  image: c.image,
                }))}
              components={{
                Option: (props) => {
                  const { innerRef, innerProps, data, isFocused } = props;
                  return (
                    <div
                      ref={innerRef}
                      {...innerProps}
                      className={`flex items-center gap-2 p-2 cursor-pointer ${
                        isFocused ? "bg-blue-100" : ""
                      }`}
                    >
                      {data.image && (
                        <img
                          src={data.image}
                          alt={data.label}
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span>{data.label}</span>
                    </div>
                  );
                },
                SingleValue: ({ data }) => (
                  <div className="flex items-center gap-2">
                    {data.image && (
                      <img
                        src={data.image}
                        alt={data.label}
                        className="w-5 h-5 object-cover rounded"
                      />
                    )}
                    <span>{data.label}</span>
                  </div>
                ),
              }}
              placeholder="Select Category"
              isClearable
              value={null}
              onChange={(option) => {
                if (option) {
                  const selected = allCategory.find(
                    (cat) => cat._id === option.value
                  );
                  setData((prev) => ({
                    ...prev,
                    category: [...prev.category, selected],
                  }));
                }
              }}
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#eff6ff", // bg-blue-50
                  borderColor: state.isFocused ? "#93c5fd" : "#e5e7eb", // focus-blue-300 else gray-200
                  borderRadius: "0.375rem",
                  padding: "2px",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#93c5fd",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 50,
                }),
              }}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {data.category.map((c, index) => (
                <div
                  key={c._id}
                  className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-sm"
                >
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-5 h-5 object-cover rounded"
                    />
                  )}
                  <span>{c.name}</span>
                  <IoClose
                    size={18}
                    className="hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemoveCategory(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SUBCATEGORY */}
          <div className="grid gap-1">
            <label className="font-medium">Sub Category</label>
            <Select
              options={allSubCategory
                .filter(
                  (c) =>
                    !data.subCategory.find((selected) => selected._id === c._id)
                )
                .map((c) => ({
                  value: c._id,
                  label: c.name,
                  image: c.image,
                }))}
              components={{
                Option: (props) => {
                  const { innerRef, innerProps, data, isFocused } = props;
                  return (
                    <div
                      ref={innerRef}
                      {...innerProps}
                      className={`flex items-center gap-2 p-2 cursor-pointer ${
                        isFocused ? "bg-blue-100" : ""
                      }`}
                    >
                      {data.image && (
                        <img
                          src={data.image}
                          alt={data.label}
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span>{data.label}</span>
                    </div>
                  );
                },
                SingleValue: ({ data }) => (
                  <div className="flex items-center gap-2">
                    {data.image && (
                      <img
                        src={data.image}
                        alt={data.label}
                        className="w-5 h-5 object-cover rounded"
                      />
                    )}
                    <span>{data.label}</span>
                  </div>
                ),
              }}
              placeholder="Select Sub Category"
              isClearable
              value={null}
              onChange={(option) => {
                if (option) {
                  const selected = allSubCategory.find(
                    (sub) => sub._id === option.value
                  );
                  setData((prev) => ({
                    ...prev,
                    subCategory: [...prev.subCategory, selected],
                  }));
                }
              }}
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#eff6ff", // bg-blue-50
                  borderColor: state.isFocused ? "#93c5fd" : "#e5e7eb",
                  borderRadius: "0.375rem",
                  padding: "2px",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#93c5fd",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 50,
                }),
              }}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {data.subCategory.map((c, index) => (
                <div
                  key={c._id}
                  className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-sm"
                >
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-5 h-5 object-cover rounded"
                    />
                  )}
                  <span>{c.name}</span>
                  <IoClose
                    size={18}
                    className="hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemoveSubCategory(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Unit, Stock, Price, Discount */}
          {[
            { id: "unit", label: "Unit", type: "text" },
            { id: "stock", label: "Number of Stock", type: "text" },
            { id: "price", label: "Price", type: "text" },
            { id: "discount", label: "Discount %", type: "text" },
          ].map(({ id, label, type }) => (
            <div
              key={id}
              className="grid gap-1"
            >
              <label
                htmlFor={id}
                className="font-medium"
              >
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                value={data[id]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                required
                className="bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200"
              />
            </div>
          ))}

          {/* Dynamic Fields */}
          {Object.keys(data.more_details).map((k, index) => (
            <div
              key={k + index}
              className="grid gap-1 relative"
            >
              <label
                htmlFor={k}
                className="font-medium flex justify-between items-center"
              >
                {k}
                <MdDelete
                  size={20}
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    const updated = { ...data.more_details };
                    delete updated[k];
                    setData((prev) => ({ ...prev, more_details: updated }));
                  }}
                />
              </label>
              <textarea
                id={k}
                value={data.more_details[k]}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    more_details: { ...prev.more_details, [k]: e.target.value },
                  }))
                }
                className="bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => setOpenAddField(true)}
            className="bg-white border border-primary-200 py-1 px-3 w-32 text-center font-semibold hover:bg-primary-100 hover:text-neutral-900 rounded"
          >
            Add Fields
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {ViewImageURL && (
        <ViewImage
          url={ViewImageURL}
          close={() => setViewImageURL("")}
        />
      )}

      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
