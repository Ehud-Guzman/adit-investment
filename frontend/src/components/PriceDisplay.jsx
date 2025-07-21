import { useMemo } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../utils/formatCurrency";

const PriceDisplay = ({ 
  price, 
  originalPrice, 
  size = "base", 
  className = "",
  isCompact = false
}) => {
  const discount = useMemo(() => {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [originalPrice, price]);

  const sizeClasses = {
    sm: {
      price: "text-sm",
      original: "text-xs",
      badge: "text-[10px] px-1 py-0.5"
    },
    base: {
      price: "text-base",
      original: "text-sm",
      badge: "text-xs px-1.5 py-0.5"
    },
    lg: {
      price: "text-lg",
      original: "text-base",
      badge: "text-xs px-2 py-1"
    },
    xl: {
      price: "text-xl font-bold",
      original: "text-lg",
      badge: "text-sm px-2 py-1"
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.base;

  return (
    <div 
      className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}
      aria-label={`Price: ${formatCurrency(price)}${discount ? 
        `, originally ${formatCurrency(originalPrice)}, ${discount}% off` : ""}`}
    >
      {/* Main Price */}
      <div className="flex items-baseline gap-1.5">
        <span className={`text-blue-700 font-bold ${currentSize.price}`}>
          {formatCurrency(price)}
        </span>
        
        {/* Discount Badge - Visible only in compact mode */}
        {isCompact && discount && (
          <span 
            className={`bg-green-100 text-green-800 font-medium rounded ${currentSize.badge}`}
            aria-hidden="true"
          >
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Original Price & Discount */}
      {originalPrice && discount && (
        <div className="flex items-baseline gap-1.5">
          <span 
            className={`line-through text-gray-500 ${currentSize.original}`}
            aria-label={`Original price: ${formatCurrency(originalPrice)}`}
          >
            {formatCurrency(originalPrice)}
          </span>
          
          {/* Discount Badge - Hidden in compact mode */}
          {!isCompact && (
            <span 
              className={`bg-green-100 text-green-800 font-medium rounded ${currentSize.badge}`}
              aria-label={`${discount}% discount`}
            >
              {discount}% OFF
            </span>
          )}
        </div>
      )}
    </div>
  );
};

PriceDisplay.propTypes = {
  price: PropTypes.number.isRequired,
  originalPrice: PropTypes.number,
  size: PropTypes.oneOf(["sm", "base", "lg", "xl"]),
  className: PropTypes.string,
  isCompact: PropTypes.bool,
};

export default PriceDisplay;