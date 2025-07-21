import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ProductSkeleton = ({ 
  count = 1, 
  className = "",
  delayMultiplier = 0.05,
  shimmerDuration = 1.8 
}) => {
  const [isStyleInjected, setIsStyleInjected] = useState(false);

  // Inject shimmer animation styles safely
  useEffect(() => {
    if (typeof document === 'undefined' || isStyleInjected) return;

    const styleId = 'shimmer-animation-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `;
      document.head.appendChild(style);
    }
    setIsStyleInjected(true);
  }, [isStyleInjected]);

  const skeletons = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      className={`bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 h-full ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * delayMultiplier,
        ease: "easeOut"
      }}
      aria-label="Loading product..."
      role="status"
      aria-busy="true"
    >
      {/* Image placeholder with optimized shimmer */}
      <div className="aspect-square bg-gradient-to-r from-gray-100 to-gray-200 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ 
            x: ["-100%", "100%"]
          }}
          transition={{ 
            repeat: Infinity,
            duration: shimmerDuration,
            ease: "linear"
          }}
        />
      </div>

      {/* Content area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
        {/* Title */}
        <div className="h-5 bg-gray-100 rounded-full w-4/5" />
        
        {/* Category/Subtitle */}
        <div className="h-4 bg-gray-100 rounded-full w-3/5 mt-1" />
        
        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <div className="h-5 bg-gray-100 rounded-full w-1/4" />
          <div className="h-4 bg-gray-100 rounded-full w-1/5" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-3">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="h-4 w-4 bg-gray-100 rounded-sm"
            />
          ))}
          <div className="h-4 bg-gray-100 rounded-full w-8 ml-1" />
        </div>
        
        {/* Add to Cart button */}
        <div className="h-10 bg-gray-100 rounded-lg mt-4" />
      </div>
    </motion.div>
  ));

  return <>{skeletons}</>;
};

export default ProductSkeleton;