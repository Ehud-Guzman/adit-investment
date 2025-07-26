// UpsellSection.jsx - Enhanced full section
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { FiStar, FiTrendingUp, FiUsers } from "react-icons/fi";

const UpsellSection = ({ suggestions = [] }) => {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
    >
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <FiTrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              You May Also Like
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                TRENDING
              </span>
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <FiUsers className="w-4 h-4" />
              Loved by 10,000+ customers
            </p>
          </div>
        </div>
        
        {/* View all link */}
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition-all">
          View All →
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {suggestions.slice(0, 8).map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {/* Rating */}
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <FiStar className="w-3 h-3 fill-current" />
                    4.8
                  </div>
                  
                  {/* Discount */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                {/* Quick add button */}
                <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <FiStar className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                  {product.name}
                </h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-blue-600 text-lg font-bold">
                      KSh {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        KSh {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiStar className="w-3 h-3" />
                    4.8 (127)
                  </span>
                  <span>•</span>
                  <span>1.2k sold</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load more section */}
      {suggestions.length > 8 && (
        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
          >
            Show More Products ({suggestions.length - 8} remaining)
          </motion.button>
        </div>
      )}
    </motion.section>
  );
};

export default UpsellSection;