import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 animate-pulse">
          <XCircle size={48} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-red-700">
          Order Canceled ❌
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm">
          Your transaction was not completed or has been canceled.  
          <br />
          You can return to the home page and try again.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
