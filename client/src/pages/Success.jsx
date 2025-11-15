import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Success = () => {
  const location = useLocation();
  const successText = location?.state?.text || "Payment";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 animate-bounce">
          <CheckCircle2 size={48} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-green-700">
          {successText} Successfully 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm">
          Thank you! Your transaction was completed successfully.
          <br />
          You’ll receive confirmation details shortly.
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
