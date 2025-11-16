import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import image1 from "../assets/minute_delivery2.PNG";
import image2 from "../assets/Best_Prices_Offers2.PNG";
import image3 from "../assets/Wide_Assortment2.png";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  console.log("product data", data);

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2">
      {/* Left Section - Product Images */}
      <div>
        <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
          <img
            src={data.image[image]}
            alt={data.name}
            className="w-full h-full object-scale-down"
          />
        </div>

        <div className="flex items-center justify-center gap-3 my-2">
          {data.image.map((img, index) => (
            <div
              key={`dot-${index}`}
              className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                index === image ? "bg-slate-300" : ""
              }`}
            ></div>
          ))}
        </div>

        <div className="grid relative">
          <div
            ref={imageContainer}
            className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none"
          >
            {data.image.map((img, index) => (
              <div
                className="w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md"
                key={`thumb-${index}`}
              >
                <img
                  src={img}
                  alt="mini-product"
                  onClick={() => setImage(index)}
                  className="w-full h-full object-scale-down"
                />
              </div>
            ))}
          </div>

          <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center">
            <button
              onClick={handleScrollLeft}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handleScrollRight}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Desktop Description Section */}
        <div className="my-4 hidden lg:grid gap-3">
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="text-base">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data.more_details).map((key, index) => (
              <div key={`detail-${key}-${index}`}>
                <p className="font-semibold">{key}</p>
                <p className="text-base">{data.more_details[key]}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Right Section - Details */}
      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <p className="bg-green-300 w-fit px-2 rounded-full">10 Min</p>
        <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
        <p>{data.unit}</p>
        <Divider />

        <div>
          <p>Price</p>
          <div className="flex items-center gap-2 lg:gap-4">
            {data.discount ? (
              <>
                <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
                  <p className="font-semibold text-lg lg:text-xl">
                    {DisplayPriceInRupees(
                      pricewithDiscount(data.price, data.discount)
                    )}
                  </p>
                </div>
                <p className="line-through">
                  {DisplayPriceInRupees(data.price)}
                </p>
                <p className="font-bold text-green-600 lg:text-2xl">
                  {data.discount}%{" "}
                  <span className="text-base text-neutral-500">Discount</span>
                </p>
              </>
            ) : (
              <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
                <p className="font-semibold text-lg lg:text-xl">
                  {DisplayPriceInRupees(data.price)}
                </p>
              </div>
            )}
          </div>
        </div>

        {data.stock === 0 ? (
          <p className="text-lg text-red-500 my-2">Out of Stock</p>
        ) : (
          <div className="my-4">
            <AddToCartButton data={data} />
          </div>
        )}

        <h2 className="font-semibold">Why shop from shopyit?</h2>

        <div>
          <div className="flex items-center gap-4 my-4">
            <img
              src={image1}
              alt="superfast delivery"
              className="w-20 h-20"
            />
            <div className="text-sm">
              <div className="font-semibold">Superfast Delivery</div>
              <p>
                Get your order delivered to your doorstep at the earliest from
                dark stores near you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 my-4">
            <img
              src={image2}
              alt="Best prices offers"
              className="w-20 h-20"
            />
            <div className="text-sm">
              <div className="font-semibold">Best Prices & Offers</div>
              <p>
                Best price destination with offers directly from the
                manufacturers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 my-4">
            <img
              src={image3}
              alt="Wide Assortment"
              className="w-20 h-20"
            />
            <div className="text-sm">
              <div className="font-semibold">Wide Assortment</div>
              <p>
                Choose from 5000+ products across food, personal care, household
                & other categories.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Description Section */}
        <div className="my-4 grid gap-3 lg:hidden">
          {" "}
          {/* Add lg:hidden */}
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="text-base">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data.more_details).map((key, index) => (
              <div key={`mobile-detail-${key}-${index}`}>
                <p className="font-semibold">{key}</p>
                <p className="text-base">{data.more_details[key]}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
