import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel"; //add
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import EditCategory from "../components/EditCategory";
// import CofirmBox from "../components/ConfirmBox";
import CofirmBox from "../components/CofirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";

//chatgpt-------------
import { useDispatch } from "react-redux";
import { setAllCategory } from "../store/productSlice";
//chatgpt------------

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });
  const dispatch = useDispatch();
  // const allCategory = useSelector((state) => state.product.allCategory);
  // console.log("all category redux", allCategory);

  // useEffect(() => {
  //   setCategoryData(allCategory);
  // }, [allCategory]);

  //**** #3 3:56:00 i commented the below part of fetchCategory and the useEffect for using the category i issued inside redux
  // instead of the below
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setCategoryData(responseData.data);
        //new---chatgpt---do the same with subcategory // 👈 Fetch fresh categories before opening
        dispatch(
          setAllCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
        //--------chatgpt-----
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  //chatgpt
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
  //end chatgpt

  useEffect(() => {
    fetchCategory();
  }, []);
  // console.log("categoryData logger", categoryData);#3 02:22:18- with the help of categoryData i can update categories

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory();
        setOpenConfirmBoxDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="">
      <div className="sticky top-[96px] lg:top-[80px] z-40 p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="text-sm font-medium text-center md:text-left">
          Category (
          <span className="text-sm text-primary-500 font-semibold">
            {categoryData.length || 0}
          </span>
          )
        </h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded"
        >
          Add Category
        </button>
      </div>

      {!categoryData[0] && !loading && <NoData />}

      {/* #3 01:57:00 desctabet version classname disp props */}
      <div className="p-4 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {categoryData.map((category, index) => {
          return (
            // for hovering edit and delete btn #3 02:07:33
 <div
  key={category._id}
  className="w-32 h-56 rounded shadow-md flex flex-col"
>
  {/* IMAGE */}
  <div className="h-36 flex items-center justify-center">
    <img
      alt={category.name}
      src={category.image}
      className="max-h-full w-full object-contain"
    />
  </div>

  {/* NAME (FIXED HEIGHT – NO OVERFLOW) */}
  <div className="h-6 px-1">
    <p
      className="text-center text-xs font-medium truncate"
      title={category.name}
    >
      {category.name}
    </p>
  </div>

  {/* ACTION BUTTONS */}
  <div className="h-9 flex gap-2 px-1 mt-auto">
    <button
      onClick={() => {
        setOpenEdit(true);
        setEditData(category);
      }}
      className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded"
    >
      Edit
    </button>

    <button
      onClick={() => {
        setOpenConfirmBoxDelete(true);
        setDeleteCategory(category);
      }}
      className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded"
    >
      Delete
    </button>
  </div>
</div>
  
          );
        })}
      </div>

      {loading && <Loading />}

      {/* #3 2:18:10 ADD triggered to call component UploadCategoryModel with passed params */}
      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {/* #3 2:12:00 EDIT triggered her to open edit component when pass callback function up in edit button click  */}
      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}

      {openConfimBoxDelete && (
        <CofirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default CategoryPage;
