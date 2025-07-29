// components/Nav/NavAd.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomProduct } from "../../services/api/products";
import { X, Sparkles, Star } from "lucide-react";

export default function NavAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [product, setProduct] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const randomProduct = await getRandomProduct();
        if (randomProduct) {
          setProduct(randomProduct);
          // Delay showing the ad
          const id = setTimeout(() => setIsVisible(true), 3000);
          setTimeoutId(id);
        }
      } catch (error) {
        console.error("Error fetching random product:", error);
      }
    };

    fetchProduct();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 400);
  };

  if (!isVisible || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ 
          opacity: 0, 
          y: -30, 
          scale: 0.9,
          rotateX: -15
        }}
        animate={{ 
          opacity: isClosing ? 0 : 1, 
          y: isClosing ? -30 : 0,
          scale: isClosing ? 0.9 : 1,
          rotateX: isClosing ? -15 : 0
        }}
        exit={{ 
          opacity: 0, 
          y: -30, 
          scale: 0.9,
          rotateX: -15
        }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="absolute right-4 top-16 z-[100]"
        style={{ perspective: "1000px" }}
      >
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              style={{
                left: `${20 + i * 12}%`,
                top: `${10 + i * 8}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative bg-gradient-to-br from-white via-gray-50/80 to-white backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 w-72 overflow-hidden"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{
            rotateY: isHovered ? 2 : 0,
            rotateX: isHovered ? -1 : 0,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: isHovered 
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)"
              : "0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)"
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-0"
            animate={{
              opacity: isHovered ? [0, 0.3, 0] : 0,
              background: [
                "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)",
                "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)"
              ]
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <div className="relative p-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <motion.div 
                className="flex items-center gap-1.5"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles size={12} className="text-amber-500" />
                <span className="text-xs font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  FEATURED
                </span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                </motion.div>
              </motion.div>
              
              <motion.button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-100 rounded-full p-1"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close ad"
              >
                <X size={14} />
              </motion.button>
            </div>

            {/* Product content */}
            <Link
              to={`/products/${product._id}`}
              className="group block"
            >
              <div className="flex items-center gap-4">
                {/* Product image with 3D effect */}
                <motion.div 
                  className="relative"
                  animate={{
                    rotateY: isHovered ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl w-20 h-20 overflow-hidden border-2 border-white shadow-lg">
                    {/* Image glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {product.images?.[0] ? (
                      <motion.img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs font-medium">No image</span>
                      </div>
                    )}
                    
                    {/* Corner highlight */}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-white/60 to-transparent rounded-bl-lg" />
                  </div>
                  
                  {/* 3D shadow */}
                  <div className="absolute inset-0 bg-gray-300/20 rounded-xl translate-x-1 translate-y-1 -z-10" />
                </motion.div>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <motion.h3 
                    className="font-semibold text-sm text-gray-800 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300"
                    animate={{ x: isHovered ? 2 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {product.name}
                  </motion.h3>
                  
                  <div className="flex items-center justify-between mt-2">
                    <motion.div
                      animate={{ scale: isHovered ? 1.05 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                       KES {product.price.toLocaleString('en-KE', { minimumFractionDigits: 2 })}

                      </span>
                    </motion.div>
                    
                    {product.discountPercentage > 0 && (
                      <motion.span 
                        className="text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 px-2 py-1 rounded-full shadow-lg"
                        animate={{ 
                          scale: isHovered ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        -{product.discountPercentage}%
                      </motion.span>
                    )}
                  </div>
                  
                  {/* Subtle call-to-action */}
                  <motion.div
                    className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ y: isHovered ? 0 : 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Click to view details →
                  </motion.div>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom highlight bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{
              scaleX: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ originX: 0 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}