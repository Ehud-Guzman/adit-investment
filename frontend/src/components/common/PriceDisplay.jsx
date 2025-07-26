// src/components/PriceDisplay.jsx
import React from "react";
import PropTypes from "prop-types";

// 💰 Formatter with fallback
export const formatPrice = (amount = 0) => {
  const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `KSh ${safeAmount.toFixed(2)}`;
  }
};

const PriceDisplay = ({ amount = 0, className = "" }) => {
  return (
    <span className={`text-gray-900 font-semibold ${className}`}>
      {formatPrice(amount)}
    </span>
  );
};

PriceDisplay.propTypes = {
  amount: PropTypes.number,
  className: PropTypes.string,
};

export default PriceDisplay;
