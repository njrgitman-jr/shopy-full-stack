//#3 08:04:00 uplaoding all subcategory.

import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";

import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import EditSubCategory from "../components/EditSubCategory";
import CofirmBox from '../components/CofirmBox'
import toast from "react-hot-toast";
import NoData from "../components/NoData";
import Loading from "../components/Loading";

//chatgpt
import { useDispatch } from "react-redux";
import { setAllSubCategory } from "../store/productSlice";
//chatgpt

const SubCategoryPage = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const fetchCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCategory });
      const { data: responseData } = response;
      if (responseData.success) {
        const sortedCategories = responseData.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setAllCategories(sortedCategories);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // //chatgpt
  const dispatch = useDispatch();
  // const fetchCategory = async () => {
  //   try {
  //     dispatch(setLoadingCategory(true));
  //     const response = await Axios({ ...SummaryApi.getCategory });
  //     const { data: responseData } = response;

  //     if (responseData.success) {
  //       dispatch(
  //         setAllCategory(
  //           responseData.data.sort((a, b) => a.name.localeCompare(b.name))
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   } finally {
  //     dispatch(setLoadingCategory(false));
  //   }
  // };

  // //end chatgpt

  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); //while fetching from api
  const columnHelper = createColumnHelper();
  const [ImageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  //pass  id object
  const [editData, setEditData] = useState({
    _id: "",
  });
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: "",
  });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response; //destructure props fron responseData

      if (responseData.success) {
        setData(responseData.data);
        //new-- 👈 Fetch fresh categories before opening refresh setAllCategory in reducer
        dispatch(
          setAllSubCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
        //--------chatgpt-----
      }
    } catch (error) {
      AxiosToastError(error + "something wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
    fetchCategory(); // 👈 Add this
  }, []);

  const filteredData =
    selectedCategory === "all"
      ? data
      : data.filter((subcat) =>
          subcat.category.some((cat) => cat._id === selectedCategory)
        );

  console.log("subcaegoryData", data);

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ getValue }) => {
        const name = getValue();
        const maxLength = 20;

        return (
          <div className="whitespace-nowrap" title={name}>
            {name.length > maxLength ? `${name.slice(0, maxLength)}...` : name}
          </div>
        );
      },
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        console.log("row");
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-8 h-8 cursor-pointer"
              onClick={() => {
                setImageURL(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <div className="w-full text-justify flex flex-wrap gap-2">
            {row.original.category.map((c) => (
              <p
                key={c._id + "table"}
                className="bg-gray-200 px-2 py-1 rounded shadow text-sm"
              >
                {c.name}
              </p>
            ))}
          </div>
        );
      },
    }),

    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original); //pass data to edit page
              }}
              className="p-2 bg-green-100 rounded-full hover:text-green-600"
            >
              <HiPencil size={20} />
            </button>
            <button
              onClick={() => {
                setOpenDeleteConfirmBox(true); //open the delete box #35:51:15
                setDeleteSubCategory(row.original); //pass data with prop which include _id
              }}
              className="p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600"
            >
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="">
      {/* Subcategory section header */}
      <div className="w-full bg-white shadow-md px-4 py-3 sticky top-[80px] z-40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left: Title */}
          <h2 className="text-sm font-medium text-center md:text-left">
            Sub Category (
            <span className="text-sm text-primary-500 font-semibold">
              {filteredData.length}
            </span>{" "}
            of{" "}
            <span className="text-sm text-primary-500 font-semibold">
              {data.length}
            </span>
            )
          </h2>

          {/* Center: Filter (centered) */}
          <div className="flex justify-center md:justify-center">
            <div className="flex items-center gap-2">
              <label
                htmlFor="categoryFilter"
                className="text-sm font-medium whitespace-nowrap"
              >
                Filter by Category:
              </label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-48 p-1.5 bg-transparent border border-gray-300 rounded outline-none text-sm focus:ring-1 focus:ring-primary-400"
              >
                <option
                  value="all"
                  className="text-gray-500"
                >
                  All Categories
                </option>
                {allCategories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Button */}
          <div className="flex justify-center md:justify-end">
            <button
              onClick={() => setOpenAddSubCategory(true)}
              className="w-48 text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded flex items-center justify-center"
            >
              Add Sub Category
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-auto w-full max-w-[95vw]">
        <DisplayTable
          data={filteredData}
          column={column}
        />
      </div>
      {!data[0] && !loading && <NoData />}
      {loading && <Loading />}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {ImageURL && (
        <ViewImage
          url={ImageURL}
          close={() => setImageURL("")}
        />
      )}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory} //#3 5:43:45 pass for api call **fetchSubCategory
        />
      )}

      {openDeleteConfirmBox && (
        <CofirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;
