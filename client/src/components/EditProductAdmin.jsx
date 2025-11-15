import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";
import { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Select from "react-select";

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  //------------
  const filteredCategories = allCategory.filter(
    (cat) => !data.category.some((selected) => selected._id === cat._id)
  );

  const filteredSubCategories = allSubCategory.filter(
    (sub) => !data.subCategory.some((selected) => selected._id === sub._id)
  );
  //--------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl],
      };
    });
    setImageLoading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", data);

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        if (close) {
          close();
        }
        fetchProductData();
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
    }
  };

  return (
    <section className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl h-[95vh] rounded shadow-lg flex flex-col overflow-hidden">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white shadow p-2 flex items-center justify-between">
            <h2 className="font-semibold">Upload Product</h2>
            <button onClick={close}>
              <IoClose size={20} />
            </button>
          </div>

          {/* Form or Content */}
          <div className="p-4">
            {/* Place your form here */}

            <form
              className="grid gap-4"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-1">
                <label
                  htmlFor="name"
                  className="font-medium"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label
                  htmlFor="description"
                  className="font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  type="text"
                  placeholder="Enter product description"
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  required
                  multiple
                  rows={3}
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none"
                />
              </div>
              {/* new image previre with drag n drop */}
              <div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Images</p>
                  <label
                    htmlFor="productImage"
                    className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer"
                  >
                    <div className="text-center flex justify-center items-center flex-col">
                      {imageLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <FaCloudUploadAlt size={35} />
                          <p>Upload Image</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="productImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleUploadImage}
                    />
                  </label>

                  {/* 🧩 Drag-and-drop reorderable images */}
                  <DragDropContext
                    onDragEnd={(result) => {
                      if (!result.destination) return;
                      const reordered = Array.from(data.image);
                      const [removed] = reordered.splice(
                        result.source.index,
                        1
                      );
                      reordered.splice(result.destination.index, 0, removed);
                      setData((prev) => ({
                        ...prev,
                        image: reordered,
                      }));
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
                                  className="h-20 w-20 bg-blue-50 border relative group cursor-grab active:cursor-grabbing"
                                >
                                  <img
                                    src={img}
                                    alt={img}
                                    className="w-full h-full object-scale-down cursor-pointer"
                                    onClick={() => setViewImageURL(img)}
                                  />
                                  <div
                                    onClick={() => handleDeleteImage(index)}
                                    className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded text-white hidden group-hover:block cursor-pointer"
                                  >
                                    <MdDelete />
                                  </div>
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
                {/* END */}
              </div>

              {/* CATEGORY */}
              <div className="grid gap-1">
                <label className="font-medium">Category</label>
                <Select
                  options={allCategory
                    .filter(
                      (c) =>
                        !data.category.find(
                          (selected) => selected._id === c._id
                        )
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
                        !data.subCategory.find(
                          (selected) => selected._id === c._id
                        )
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
                      backgroundColor: "#eff6ff",
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

              <div className="grid gap-1">
                <label
                  htmlFor="unit"
                  className="font-medium"
                >
                  Unit
                </label>
                <input
                  id="unit"
                  type="text"
                  placeholder="Enter product unit"
                  name="unit"
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="stock"
                  className="font-medium"
                >
                  Number of Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  placeholder="Enter product stock"
                  name="stock"
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="price"
                  className="font-medium"
                >
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  placeholder="Enter product price"
                  name="price"
                  value={data.price}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>

              <div className="grid gap-1">
                <label
                  htmlFor="discount"
                  className="font-medium"
                >
                  Discount
                </label>
                <input
                  id="discount"
                  type="number"
                  placeholder="Enter product discount"
                  name="discount"
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>

              {/**add more field**/}
              {/* {Object?.keys(data?.more_details)?.map((k, index) => {
                return (
                  <div
                    key={k}
                    className="grid gap-1"
                  >
                    <label
                      htmlFor={k}
                      className="font-medium"
                    >
                      {k}
                    </label>
                    <input
                      id={k}
                      type="text"
                      value={data?.more_details[k]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setData((preve) => {
                          return {
                            ...preve,
                            more_details: {
                              ...preve.more_details,
                              [k]: value,
                            },
                          };
                        });
                      }}
                      required
                      className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                    />
                  </div>
                );
              })} */}
              {Object?.keys(data?.more_details)?.map((k, index) => {
                return (
                  <div
                    key={k}
                    className="grid gap-1 relative border rounded p-2 bg-blue-50"
                  >
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor={k}
                        className="font-medium"
                      >
                        {k}
                      </label>

                      {/* 🗑️ Remove icon for this custom field */}
                      <MdDelete
                        size={20}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                        title="Remove this custom field"
                        onClick={() => {
                          const updated = { ...data.more_details };
                          delete updated[k];
                          setData((prev) => ({
                            ...prev,
                            more_details: updated,
                          }));
                        }}
                      />
                    </div>

                    <input
                      id={k}
                      type="text"
                      value={data.more_details[k]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setData((prev) => ({
                          ...prev,
                          more_details: {
                            ...prev.more_details,
                            [k]: value,
                          },
                        }));
                      }}
                      required
                      className="bg-white p-2 outline-none border focus-within:border-primary-200 rounded"
                    />
                  </div>
                );
              })}

              <div
                onClick={() => setOpenAddField(true)}
                className=" hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded"
              >
                Add Fields
              </div>

              <button className="bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold">
                Update Product
              </button>
            </form>
          </div>
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
      </div>
    </section>
  );
};

export default EditProductAdmin;
