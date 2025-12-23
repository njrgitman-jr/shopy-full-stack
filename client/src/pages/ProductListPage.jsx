// client/src/pages/ProductListPage.jsx

import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page,
          limit: 1000000000,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  useEffect(() => {
    const sub = AllSubCategory.filter((s) =>
      s.category.some((el) => el._id == categoryId)
    );
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/* ===== SUBCATEGORY SIDEBAR (FIXED) ===== */}
        <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll flex flex-col shadow-md scrollbarCustom bg-white">
          {DisplaySubCatory.map((s) => {
            const link = `/${valideURLConvert(s?.category[0]?.name)}-${
              s?.category[0]?._id
            }/${valideURLConvert(s.name)}-${s._id}`;

            const isActive = subCategoryId === s._id;

            return (
              <Link
                to={link}
                key={s._id}
                className={`relative w-full flex flex-col lg:flex-row items-center
                  p-2 border-b box-border
                  lg:h-16
                  hover:bg-green-100 cursor-pointer
                  ${isActive ? "bg-green-100" : ""}
                `}
              >
                {/* FULL HEIGHT RED ACTIVE LINE */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-full"></div>
                )}

                {/* IMAGE */}
                <div className="w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded">
                  <img
                    src={s.image}
                    alt="subCategory"
                    className="w-14 h-14 lg:w-12 object-scale-down"
                  />
                </div>

                {/* NAME */}
                <p
                  className={`text-[11px] lg:text-base text-center lg:text-left mt-1 lg:mt-0 break-words
                    ${isActive ? "font-bold text-black" : ""}
                  `}
                >
                  {s.name}
                </p>
              </Link>
            );
          })}
        </div>

        {/* ===== PRODUCT AREA ===== */}
        <div className="sticky top-20">
          <div className="bg-white shadow-md p-4 z-10 flex items-center justify-between">
            <h3 className="font-semibold">{subCategoryName}</h3>
            {!loading && (
              <span className="text-sm text-gray-500">{totalPage} Items</span>
            )}
          </div>

          <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
              {data.map((p, index) => (
                <CardProduct
                  key={p._id + "productSubCategory" + index}
                  data={p}
                />
              ))}
            </div>
          </div>

          {loading && <Loading />}
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;

// //client/src/pages/ProductListPage.jsx

// import React, { useEffect, useState } from "react";
// import Axios from "../utils/Axios"; // Custom Axios instance for API requests
// import SummaryApi from "../common/SummaryApi"; // Object containing API endpoint configs
// import { Link, useParams } from "react-router-dom"; // Routing utilities
// import AxiosToastError from "../utils/AxiosToastError"; // Custom error handler for Axios
// import Loading from "../components/Loading"; // Loading spinner component
// import CardProduct from "../components/CardProduct"; // Component to render each product
// import { useSelector } from "react-redux"; // Redux hook to access state
// import { valideURLConvert } from "../utils/valideURLConvert"; // Utility to convert string to URL-safe format

// const ProductListPage = () => {
//   // React state hooks
//   const [data, setData] = useState([]); // Stores fetched products
//   const [page, setPage] = useState(1); // Pagination state
//   const [loading, setLoading] = useState(false); // Loading state
//   const [totalPage, setTotalPage] = useState(1); // Total number of pages from API
//   const params = useParams(); // Extracts dynamic route params from URL

//   // Redux selector to get all subcategories from the store
//   const AllSubCategory = useSelector((state) => state.product.allSubCategory);

//   const [DisplaySubCatory, setDisplaySubCategory] = useState([]); // Filtered subcategories for the current category

//   console.log(AllSubCategory); // Debugging: see subcategory data from store

//   // Parse subCategory param from URL and prepare a readable name
//   const subCategory = params?.subCategory?.split("-"); // Split by dash
//   const subCategoryName = subCategory
//     ?.slice(0, subCategory?.length - 1) // Remove last part (ID)
//     ?.join(" "); // Join remaining parts as readable name

//   // Extract categoryId and subCategoryId from URL params
//   const categoryId = params.category.split("-").slice(-1)[0]; // Last element of category param
//   const subCategoryId = params.subCategory.split("-").slice(-1)[0]; // Last element of subCategory param

//   // Function to fetch products based on category, subcategory, and pagination
//   const fetchProductdata = async () => {
//     try {
//       setLoading(true); // Show loading spinner
//       const response = await Axios({
//         ...SummaryApi.getProductByCategoryAndSubCategory, // Spread API config
//         data: {
//           categoryId: categoryId,
//           subCategoryId: subCategoryId,
//           page: page,
//           limit: 1000000000, // Number of products per page
//         },
//       });

//       const { data: responseData } = response;

//       if (responseData.success) {
//         if (responseData.page == 1) {
//           setData(responseData.data); // First page: replace data
//         } else {
//           setData([...data, ...responseData.data]); // Append next pages
//         }
//         setTotalPage(responseData.totalCount); // Update total pages count
//       }
//     } catch (error) {
//       AxiosToastError(error); // Show toast notification for error
//     } finally {
//       setLoading(false); // Hide loading spinner
//     }
//   };

//   // Fetch products whenever URL params change
//   useEffect(() => {
//     fetchProductdata();
//   }, [params]);

//   // Filter subcategories for the current category whenever params or store change
//   useEffect(() => {
//     const sub = AllSubCategory.filter((s) => {
//       // Check if subcategory belongs to current category
//       const filterData = s.category.some((el) => el._id == categoryId);
//       return filterData ? filterData : null;
//     });
//     setDisplaySubCategory(sub); // Set filtered subcategories
//   }, [params, AllSubCategory]);

//   return (
//     <section className="sticky top-24 lg:top-20">
//       <div className="container sticky top-24  mx-auto grid grid-cols-[90px,1fr]  md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
//         {/* Subcategory sidebar */}
//         <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2">
//           {DisplaySubCatory.map((s, index) => {
//             const link = `/${valideURLConvert(s?.category[0]?.name)}-${
//               s?.category[0]?._id
//             }/${valideURLConvert(s.name)}-${s._id}`;

//             const isActive = subCategoryId === s._id; // Highlight currently active subcategory

//             return (
//               <Link
//                 to={link}
//                 key={s._id}
//                 className={`relative w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b
//                   hover:bg-green-100 cursor-pointer
//                   ${isActive ? "bg-green-100" : ""}
//                 `}
//               >
//                 {/* Red side line indicator for active subcategory */}
//                 {isActive && (
//                   <div className="absolute right-0 inset-y-0 w-1 rounded-l-full bg-red-500"></div>
//                 )}

//                 {/* Subcategory image */}
//                 <div className="w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border">
//                   <img
//                     src={s.image}
//                     alt="subCategory"
//                     className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
//                   />
//                 </div>

//                 {/* Subcategory name */}
//                 <p
//                   className={`text-[11px] lg:text-base text-center lg:text-left mt-1 lg:mt-0 break-words
//                     ${isActive ? "font-bold text-black" : ""}
//                   `}
//                 >
//                   {s.name}
//                 </p>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Product display area */}
//         <div className="sticky top-20">
//           {/* Subcategory title */}
//           <div className="bg-white shadow-md p-4 z-10 flex items-center justify-between">
//             <h3 className="font-semibold">{subCategoryName}</h3>

//             {/* TOTAL PRODUCT COUNT */}
//             {!loading && (
//               <span className="text-sm text-gray-500">
//                 {totalPage} Items
//               </span>
//             )}
//           </div>

//           <div>
//             <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
//               {/* Grid of products */}
//               <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 ">
//                 {data.map((p, index) => {
//                   return (
//                     <CardProduct
//                       data={p}
//                       key={p._id + "productSubCategory" + index} // Unique key for React
//                     />
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Loading spinner */}
//             {loading && <Loading />}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductListPage;
