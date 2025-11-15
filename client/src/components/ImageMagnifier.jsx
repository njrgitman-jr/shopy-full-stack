import React, { useState, useRef } from "react";

const ImageMagnifier = ({ src, zoom = 2, width = 400, height = 400 }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <img
        src={src}
        ref={imgRef}
        className="w-full h-full object-contain"
        onMouseEnter={() => setShowZoom(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowZoom(false)}
        alt="product"
      />

      {showZoom && (
        <div
          className="absolute top-0 left-full ml-2 w-80 h-80 border border-gray-300 shadow-lg overflow-hidden z-50"
          style={{
            width: "500px", // ⬅️ Increased zoom window width
            height: "500px", // ⬅️ Increased zoom window height
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
          }}
        ></div>
      )}
    </div>
  );
};

export default ImageMagnifier;
