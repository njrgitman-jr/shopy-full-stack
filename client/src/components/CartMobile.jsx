import React from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { FaCartShopping } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const CartMobileLink = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);

  const user = useSelector((state) => state.user);

  // ✅ Show only if logged in AND role is 'user'
  if (!user?._id || user?.role !== "USER") return null;

  return (
    <>
      {cartItem[0] && (
        <div className="sticky bottom-4 p-2">
          <div className="bg-green-400 px-2 py-1 rounded text-neutral-100 text-sm flex items-center justify-between gap-3 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500 rounded w-fit">
                <FaCartShopping className="animate-bounce" />
              </div>
              <div className="text-xs">
                <p>{totalQty} items</p>
                <p>{DisplayPriceInRupees(totalPrice)}</p>
              </div>
            </div>

            <Link to={"/cart"} className="flex items-center gap-1">
              <span className="text-sm">View Cart.</span>
              <FaCaretRight />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobileLink;
