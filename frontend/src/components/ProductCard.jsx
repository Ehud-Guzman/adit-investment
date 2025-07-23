import { motion } from "framer-motion";
import {
  FiHeart,
  FiEye,
  FiShoppingCart
} from "react-icons/fi";
import { useState } from "react";
import PropTypes from "prop-types";
import RatingStars from "./RatingStars";
import PriceDisplay from "./PriceDisplay";

const ProductCard = ({
  product,
  size = "medium",
  onAddToCart = () => console.warn("⚠️ Missing 'onAddToCart' handler"),
  onWishlistToggle = () => console.warn("⚠️ Missing 'onWishlistToggle' handler"),
  onQuickView = () => console.warn("⚠️ Missing 'onQuickView' handler"),
  isInWishlist = false,
  loading = false
}) => {
  const {
    _id,
    name = "Unnamed Product",
    price = 0,
    originalPrice = null,
    featured = false,
    rating = 0,
    reviewCount = 0,
    stock = 0,
    description = "",
    sku = null,
    imageUrl = "",
    images = [],
  } = product || {};

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const imageSrc = !imageError
    ? imageUrl || images[0] || "/placeholder-product.jpg"
    : "/placeholder-product.jpg";

  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const sizes = {
    small: {
      container: "max-w-[160px] sm:max-w-[180px]",
      image: "aspect-[3/2.5] sm:aspect-[3/2.8]",
      text: "text-xs sm:text-[13px]",
      padding: "p-2 sm:p-2.5",
      button: "py-1 px-2 text-xs",
      icon: "size-3 sm:size-3.5",
      badge: "text-[10px] px-1.5 py-0.5",
      actionBtn: "p-1 sm:p-1.5",
      descriptionLines: 1,
      ratingSize: "sm",
    },
    medium: {
      container: "max-w-[220px] sm:max-w-[240px]",
      image: "aspect-[4/3] sm:aspect-[4/3.2]",
      text: "text-sm sm:text-[15px]",
      padding: "p-3 sm:p-3.5",
      button: "py-2 px-3 text-sm",
      icon: "size-4 sm:size-[18px]",
      badge: "text-xs px-2 py-1",
      actionBtn: "p-1.5 sm:p-2",
      descriptionLines: 2,
      ratingSize: "md",
    },
    large: {
      container: "max-w-[280px] sm:max-w-[300px]",
      image: "aspect-[1/1] sm:aspect-[1/0.9]",
      text: "text-base sm:text-[16px]",
      padding: "p-4 sm:p-5",
      button: "py-2.5 px-4 text-base",
      icon: "size-5 sm:size-6",
      badge: "text-sm px-2.5 py-1",
      actionBtn: "p-2 sm:p-2.5",
      descriptionLines: 3,
      ratingSize: "lg",
    },
  };

  const currentSize = sizes[size] || sizes.medium;

  const handleKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -4, boxShadow: "0 6px 12px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full group relative ${
        loading ? "opacity-70 pointer-events-none" : ""
      } ${currentSize.container}`}
      role="article"
      aria-label={`Product card for ${name}`}
    >
      {loading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse z-10 rounded-lg" />
      )}

      {/* Image */}
      <div className={`relative ${currentSize.image} overflow-hidden bg-gray-50`}>
        <motion.img
          src={imageSrc}
          alt={imageError ? "Image not available" : name}
          className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
          loading="lazy"
          width={300}
          height={300}
        />
        {imageLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 z-[1]">
          {featured && (
            <motion.span className={`bg-blue-600 text-white rounded-full font-medium ${currentSize.badge}`}>
              Featured
            </motion.span>
          )}
          {discount && (
            <motion.span className={`bg-green-500 text-white rounded-full font-medium ${currentSize.badge}`}>
              {discount}% OFF
            </motion.span>
          )}
          {stock <= 0 && (
            <motion.span className={`bg-red-500 text-white rounded-full font-medium ${currentSize.badge}`}>
              Sold Out
            </motion.span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-[1]">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(_id);
            }}
            onKeyDown={(e) => handleKeyDown(e, () => onWishlistToggle(_id))}
            className={`bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-gray-100 transition-colors ${
              isInWishlist ? "!bg-red-100" : ""
            } ${currentSize.actionBtn}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isInWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          >
            <FiHeart
              className={`${isInWishlist ? "text-red-500 fill-current" : "text-gray-700 hover:text-red-500"} ${currentSize.icon}`}
            />
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(_id);
            }}
            onKeyDown={(e) => handleKeyDown(e, () => onQuickView(_id))}
            className={`bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-gray-100 transition-colors ${currentSize.actionBtn}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Quick view ${name}`}
          >
            <FiEye className={`text-gray-700 hover:text-blue-600 ${currentSize.icon}`} />
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className={`${currentSize.padding} flex-1 flex flex-col`}>
        <h3 className={`${currentSize.text} font-medium text-gray-800 mb-1 leading-tight line-clamp-2`} title={name}>
          {name}
        </h3>

        <div className="mb-1.5 flex items-center">
          <RatingStars rating={rating} size={currentSize.ratingSize} showNumber={size !== "small"} />
          {size !== "small" && (
            <span className="text-gray-500 text-xs ml-1">
              ({reviewCount ?? 0} review{reviewCount === 1 ? "" : "s"})
            </span>
          )}
        </div>

        {description && size !== "small" && (
          <p className={`text-gray-500 mb-2 text-xs sm:text-sm line-clamp-${currentSize.descriptionLines}`} title={description}>
            {description}
          </p>
        )}

        {sku && size !== "small" && (
          <p className="text-xs text-gray-400 mb-1">SKU: {sku}</p>
        )}

        {/* Price + Add to Cart */}
        <div className="mt-auto flex flex-col gap-2 sm:gap-3">
          <PriceDisplay
            price={price}
            originalPrice={originalPrice}
            size={size}
            isCompact={size === "small"}
          />

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(_id);
            }}
            onKeyDown={(e) => handleKeyDown(e, () => onAddToCart(_id))}
            disabled={stock <= 0 || loading}
            className={`w-full flex items-center justify-center gap-1.5 rounded-md transition-colors ${
              currentSize.button
            } ${
              stock <= 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            whileHover={stock > 0 ? { scale: 1.02 } : {}}
            whileTap={stock > 0 ? { scale: 0.98 } : {}}
            aria-label={`Add ${name} to cart`}
          >
            <FiShoppingCart className={currentSize.icon} />
            {stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    featured: PropTypes.bool,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    stock: PropTypes.number,
    description: PropTypes.string,
    sku: PropTypes.string,
  }).isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onAddToCart: PropTypes.func,
  onWishlistToggle: PropTypes.func,
  onQuickView: PropTypes.func,
  isInWishlist: PropTypes.bool,
  loading: PropTypes.bool,
};

export default ProductCard;
