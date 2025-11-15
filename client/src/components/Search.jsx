import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoClose } from "react-icons/io5"; // 👈 close icon
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const params = useLocation();
  const initialText = params.search.slice(3);
  const [searchText, setSearchText] = useState(initialText || "");

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setSearchText(value);
    const url = `/search?q=${value}`;
    navigate(url);
  };

  const clearSearch = () => {
    setSearchText("");
    navigate("/search?q=");
  };

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200 relative">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to={"/"}
            className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md"
          >
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
            <IoSearch size={22} />
          </button>
        )}
      </div>

      <div className="relative w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center cursor-text"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center">
            <input
              type="text"
              placeholder="Search for item and more."
              autoFocus
              value={searchText}
              className="bg-transparent w-full h-full outline-none pr-8"
              onChange={handleOnChange}
            />
            {searchText && (
              <button
                onClick={clearSearch}
                className="absolute right-2 text-gray-400 hover:text-gray-600"
              >
                <IoClose size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
