import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-50 to-white">
      <FiCheckCircle className="text-green-500 text-6xl mb-6" />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Thank you for your order!</h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
         We’ve received your order and we’re working on it. You’ll receive updates via email or phone shortly.
      </p>

      <Link
        to="/account/orders "
        className="inline-block bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
      >
        Back to My Orders
      </Link>
    </div>
  );
};

export default ThankYou;
