// client/src/components/

import React from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import { MdAccessTime } from "react-icons/md";

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const discountedPrice = pricewithDiscount(data.price, data.discount);

  return (
    <Link
      to={url}
      className="relative border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white overflow-hidden"
    >
      {/* 🟦 Discount Badge */}
      {Boolean(data.discount) && (
        <div className="absolute top-2 left-2 bg-blue-700 flex flex-col items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-sm shadow-md z-10">
          <span className="text-[10px] sm:text-xs font-bold leading-none animate-pulse text-gray-50">
            {data.discount}%
          </span>
          <span className="text-[9px] sm:text-[11px] mt-1 sm:mt-2 font-semibold leading-none text-yellow-400">
            OFF
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data.image?.[0] || "/placeholder.png"}
          className="w-full h-full object-contain lg:scale-125"
          alt={data.name}
        />
      </div>

      {/* Delivery Time */}
      <div className="flex items-center gap-1 px-2">
        <div className="flex items-center gap-1 rounded text-xs w-fit p-[1px] px-2 text-amber-700 bg-amber-50">
          <MdAccessTime className="text-amber-700 text-sm" />
          <span>10 min</span>
        </div>
      </div>

      {/* Product Name */}
      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
        {data.name}
      </div>

      {/* Unit */}
      <div className="w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base text-gray-500">
        {data.unit}
      </div>

      {/* Price + Add to Cart */}
      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
        <div className="flex flex-col items-start">
          <div className="flex flex-col">
            <div className="font-extrabold text-[10px] sm:text-xs lg:text-sm text-green-700 leading-tight">
              {DisplayPriceInRupees(discountedPrice)}
            </div>

            {Boolean(data.discount) && (
              <div className="text-gray-600 line-through text-[10px] sm:text-xs lg:text-sm leading-tight mt-0.5">
                {DisplayPriceInRupees(data.price)}
              </div>
            )}
          </div>
        </div>

        <div>
          {data.stock === 0 ? (
            <p className="text-red-500 text-sm text-center">Out of stock</p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
