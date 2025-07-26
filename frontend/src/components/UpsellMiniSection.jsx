// UpsellMiniSection.jsx - Enhanced recommendations
import React from "react";
import { motion } from "framer-motion";
import { FiPlus, FiStar, FiTrendingUp } from "react-icons/fi";

const UpsellMiniSection = ({ suggestions = [] }) => {
  if (!suggestions.length) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100 px-6 py-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-purple-100 rounded-full">
          <FiTrendingUp className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Perfect Additions
        </h3>
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
          HOT
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Complete your setup with these popular items
      </p>

      <div className="grid grid-cols-2 gap-3">
        {suggestions.slice(0, 4).map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            {/* Product Image */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-28">
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
              />
              
              {/* Add to cart button */}
              <button className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-blue-600 hover:text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                <FiPlus className="w-3 h-3" />
              </button>
              
              {/* Rating badge */}
              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <FiStar className="w-2.5 h-2.5 fill-current" />
                4.5
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                {product.name}
              </h4>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-blue-600 text-sm font-bold">
                    KSh {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-500 line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                {/* Discount badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View all button */}
      {suggestions.length > 4 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
        >
          View All Recommendations (+{suggestions.length - 4} more)
        </motion.button>
      )}
    </div>
  );
};

export default UpsellMiniSection;