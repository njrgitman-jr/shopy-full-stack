// Import React and required hooks
import React, { useEffect, useState } from "react";

// Import custom modules, utilities, and components
import SummaryApi from "../common/SummaryApi"; // API configuration object (contains backend endpoints)
import AxiosToastError from "../utils/AxiosToastError"; // Utility to show error toast on Axios failures
import Axios from "../utils/Axios"; // Preconfigured Axios instance
import Loading from "../components/Loading"; // Loading spinner component
import ProductCardAdmin from "../components/ProductCardAdmin"; // Admin view of individual product cards
import { IoSearchOutline, IoClose } from "react-icons/io5"; // Search and Close icons from react-icons
import EditProductAdmin from "../components/EditProductAdmin"; // (Unused in this file, possibly for editing products)
import NoData from "../components/NoData"; // Component to display when no data is available

// Main functional component for ProductAdmin page
const ProductAdmin = () => {
  // ---------- STATE MANAGEMENT ----------
  const [productData, setProductData] = useState([]); // Stores the list of products fetched from backend
  const [page, setPage] = useState(1); // Current pagination page number
  const [loading, setLoading] = useState(false); // Loading state to control spinners
  const [totalPageCount, setTotalPageCount] = useState(1); // Total number of available pages from backend
  const [search, setSearch] = useState(""); // Search input text
  const [totalProductCount, setTotalProductCount] = useState(0); // Total number of products found

  // ---------- CUSTOM DEBOUNCE HOOK ----------
  // This hook delays the update of a value (useful for search inputs)
  // It prevents making too many API calls as user types
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler); // Cleanup timeout on each re-render
    }, [value, delay]);

    return debouncedValue; // Returns the final debounced value
  }

  // ---------- FETCH PRODUCT DATA FUNCTION ----------
  // Fetches paginated product data from backend using Axios
  const fetchProductData = async () => {
    if (loading) return; // Prevent duplicate API calls while loading
    try {
      setLoading(true); // Show loading spinner

      // Send API request using Axios configuration
      const response = await Axios({
        ...SummaryApi.getProduct, // Spread pre-defined API config
        data: {
          page: page, // Send current page number
          limit: 12, // Limit number of products per page
          search: search, // Send search query if any
        },
      });

      const { data: responseData } = response;
      console.log("product page : ", responseData); // Debug log

      // On success, update state with fetched data
      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage); // Total pages returned from backend
        setTotalProductCount(responseData.totalCount); // Total products count
        setProductData(responseData.data); // Actual product list
      }
    } catch (error) {
      // Show toast notification if API request fails
      AxiosToastError(error);
    } finally {
      // Hide loading spinner when request completes (success or fail)
      setLoading(false);
    }
  };

  // ---------- PAGINATION HANDLERS ----------
  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1); // Go to next page
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1); // Go to previous page
    }
  };

  // ---------- SEARCH HANDLER ----------
  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value); // Update search query
    setPage(1); // Reset to first page when new search starts
  };

  // Use debounced version of search term
  const debouncedSearch = useDebounce(search, 300);

  // ---------- FETCH DATA WHEN SEARCH OR PAGE CHANGES ----------
  useEffect(() => {
    fetchProductData(); // Fetch product data when debounced search or page changes
  }, [debouncedSearch, page]);

  // Debug logs (optional)
  console.log("search : ", search);
  console.log("product data :", productData);

  // ---------- COMPONENT UI ----------
  return (
    <section className="">
      {/* Header Section with Title, Info, and Search Box */}
      <div className="py-3 px-4 bg-white shadow-md flex items-center justify-between gap-4 sticky top-24 lg:top-20 z-40 flex-wrap">
        {/* Left: Page Title */}
        <h2 className="font-semibold text-lg flex items-center">Product</h2>

        {/* Center: Display info about search results or total products */}
        <div className="text-gray-600 text-sm min-w-fit flex items-center">
          {search ? (
            // If searching, show number of results found
            <span>
              Found <strong>{totalProductCount}</strong> result
              {totalProductCount !== 1 && "s"} for "<strong>{search}</strong>"
            </span>
          ) : (
            // If not searching, show total products
            <span>
              Showing <strong>{totalProductCount}</strong> product
              {totalProductCount !== 1 && "s"}
            </span>
          )}
        </div>

        {/* Right: Search Input Box */}
        <div className="flex items-center h-10 w-full sm:w-64 md:w-80 lg:w-[400px] ml-auto bg-blue-50 px-4 gap-3 rounded border focus-within:border-primary-200 relative">
          <IoSearchOutline size={22} /> {/* Search icon */}
          <input
            type="text"
            placeholder="Search product here ..."
            className="h-full w-full outline-none bg-transparent"
            value={search}
            onChange={handleOnChange}
          />
          {/* If there is a search term, show close (clear) icon */}
          {search && (
            <IoClose
              size={20}
              className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setSearch("")} // Clear search input
            />
          )}
        </div>
      </div>
      {/* Conditional Rendering for Loading or Empty State */}
      {loading && productData.length === 0 && <Loading />}{" "}
      {/* Show spinner if loading and no data */}
      {!loading && productData.length === 0 && <NoData />}{" "}
      {/* Show "No Data" if not loading and data is empty */}
      {/* Main Content Section */}
      <div className="p-4 bg-blue-50 ">
        <div className="min-h-[65vh]">
          {/* Product Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {productData.map((p) => (
              <ProductCardAdmin
                key={p._id} // Unique key for each product
                data={p} // Pass individual product data
                fetchProductData={fetchProductData} // Function to refresh list after edit/delete
                className="product-card"
              />
            ))}
          </div>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={handlePrevious}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Previous
          </button>
          {/* Display current page / total pages */}
          <button className="w-full bg-slate-100">
            {page}/{totalPageCount}
          </button>
          <button
            onClick={handleNext}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

// Export component as default
export default ProductAdmin;
