import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

// 🖼️ Import multiple banner images

import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.jpg";

import bannerMobile1 from "../assets/banner-mobile1.jpg";
import bannerMobile2 from "../assets/banner-mobile2.jpg";
import bannerMobile3 from "../assets/banner-mobile3.jpg";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  // ✅ Handle category click navigation
  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );
    if (!subcategory) return;
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
    navigate(url);
  };

  // 🖼️ Arrays of images for desktop and mobile
  const desktopBanners = [banner1, banner2, banner3, banner4];
  const mobileBanners = [bannerMobile1, bannerMobile2, bannerMobile3];

  // 🎠 Slider logic
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % desktopBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setCurrentIndex((currentIndex + 1) % desktopBanners.length);
  const prevSlide = () =>
    setCurrentIndex(
      (currentIndex - 1 + desktopBanners.length) % desktopBanners.length
    );

  return (
    <section className="bg-white pt-2 md:pt-2 lg:pt-2">
      {/* 🌆 Banner Slider Section */}
      <div className="container mx-auto relative overflow-hidden rounded-lg">
        {/* Desktop Slider */}
        <div className="hidden lg:block relative h-[255px]">
          {/* Reduced height for desktop (15% less) */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${desktopBanners.length * 100}%`,
            }}
          >
            {desktopBanners.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`banner-${index}`}
                className="w-full h-full flex-shrink-0 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/70"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/70"
          >
            ›
          </button>
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden relative h-[162px]">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${mobileBanners.length * 100}%`,
            }}
          >
            {mobileBanners.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`mobile-banner-${index}`}
                className="w-full h-full flex-shrink-0 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/70"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/70"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 w-full flex justify-center gap-2">
          {desktopBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentIndex ? "bg-white" : "bg-gray-400"
              } transition-all`}
            ></button>
          ))}
        </div>
      </div>
{/* 🗂️ Category Grid Section */}
{/* 🗂️ Category Grid Section */}
<div className="container mx-auto px-4 my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-10 gap-2">
  {loadingCategory
    ? new Array(12).fill(null).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
        >
          <div className="bg-blue-100 min-h-24 rounded"></div>
          <div className="bg-blue-100 h-8 rounded"></div>
        </div>
      ))
    : categoryData.map((cat) => (
        <div
          key={cat._id}
          className="w-full cursor-pointer group overflow-hidden rounded"
          onClick={() => {
            // Delay navigation to let the animation play on mobile
            setTimeout(() => {
              handleRedirectProductListpage(cat._id, cat.name);
            }, 200);
          }}
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="
              w-full
              h-28 sm:h-auto
              object-cover
              transition-transform
              duration-500
              ease-out
              scale-110
              group-hover:scale-95
              group-active:scale-95
            "
          />
        </div>
      ))}
</div>





      {/* 🛒 Display Category-wise Products */}
      {categoryData?.map((c) => (
        <CategoryWiseProductDisplay
          key={c?._id}
          id={c?._id}
          name={c?.name}
        />
      ))}
    </section>
  );
};

export default Home;
