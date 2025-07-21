// components/QuickView/QuickViewHeader.jsx
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import RatingStars from "../RatingStars";

const QuickViewHeader = ({
  product,
  localReviewCount,
  isInWishlist,
  handleWishlistToggle,
}) => {
  return (
    <div className="flex justify-between items-start mb-4 sm:mb-5">
      <div>
        <h2
          id="quick-view-title"
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-1"
        >
          {product.name}
        </h2>
        <div className="flex items-center gap-2">
          <RatingStars
            rating={product.rating || 0}
            size="md"
            showNumber={true}
          />
          <span className="text-sm text-gray-500">
            ({localReviewCount} reviews)
          </span>
        </div>
      </div>

      <motion.button
        onClick={handleWishlistToggle}
        className={`p-2 rounded-full ${
          isInWishlist
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-200 hover:bg-gray-300"
        } transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <FiHeart size={20} fill={isInWishlist ? "white" : "none"} />
      </motion.button>
    </div>
  );
};

export default QuickViewHeader;
