import React, { useEffect, useRef, useState } from "react";
import logoShopyit from "../assets/shopyit5.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs"; // 🌞🌙 icons
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === "/search";
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  console.log("cartItem", cartItem);

  // const [totalPrice, setTotalPrice] = useState(0);
  // const [totalQty, setTotalQty] = useState(0);

  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  const [isDayTime, setIsDayTime] = useState(true); // 🌞 or 🌙
  const userMenuRef = useRef(null);

  const redirectToLoginPage = () => navigate("/login");

  const handleCloseUserMenu = () => setOpenUserMenu(false);

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  //  total item and total price
  // useEffect(() => {
  //   const qty = cartItem.reduce((preve, curr) => {
  //     return preve + curr.quantity;
  //   }, 0);
  //   console.log("qty : ", qty);
  //   setTotalQty(qty);

  //   const tPrice = cartItem.reduce((preve, curr) => {
  //     return preve + curr.productId.price * curr.quantity;
  //   }, 0);
  //   setTotalPrice(tPrice);

  // }, [cartItem]);

  // Detect outside clicks for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openUserMenu]);

  // ⏰ Detect current time for day/night display
  useEffect(() => {
    const hour = new Date().getHours();
    setIsDayTime(hour >= 6 && hour < 18); // Day between 6am–6pm
  }, []);

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-50 flex flex-col justify-center gap-1 bg-white transition-colors duration-300">
      {/* Hide header on mobile search page */}
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center h-full p-2 justify-between">
          {/* ----------------- LOGO ----------------- */}
          <div className="h-full">
            <Link
              to={"/"}
              className="h-full flex justify-center items-center"
            >
              <img
                src={logoShopyit}
                width={70}
                height={70}
                alt="logo"
                className="hidden lg:block animate-none"
              />
              <img
                src={logoShopyit}
                width={35}
                height={35}
                alt="logo"
                className="lg:hidden mt-2 animate-none"
              />
            </Link>
          </div>

          {/* ----------------- SEARCH (desktop only) ----------------- */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* ----------------- USER + TIME ICON + CART ----------------- */}
          <div className="flex items-center gap-4">
            {/* 🌗 Show time-based icon (not clickable) */}
            <div
              className="flex items-center gap-1 text-lg px-2 text-gray-700 select-none"
              // title={isDayTime ? "Daytime" : "Nighttime"}
            >
              {isDayTime ? (
                <BsSunFill
                  className="text-yellow-400"
                  size={22}
                />
              ) : (
                <BsMoonStarsFill
                  className="text-blue-600"
                  size={22}
                />
              )}
              {/* <span className="hidden lg:inline text-sm font-medium">
                {isDayTime ? "Day" : "Night"}
              </span> */}
            </div>

            {/* Mobile: user icon */}
            <button
              className="text-neutral-600 lg:hidden"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={26} />
            </button>

            {/* Desktop: user + cart */}
            <div className="hidden lg:flex items-center gap-8">
              {/* User dropdown */}
              {user?._id ? (
                <div
                  className="relative"
                  ref={userMenuRef}
                >
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={22} />
                    ) : (
                      <GoTriangleDown size={22} />
                    )}
                  </div>

                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="text-lg px-2 hover:underline"
                >
                  Login
                </button>
              )}

              {/* Cart button */}
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
              >
                <div className="animate-bounce">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold text-sm">
                  {cartItem[0] ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MOBILE SEARCH ----------------- */}
      <div className="container mx-auto px-2 lg:hidden mb-2">
        <Search />
      </div>
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
