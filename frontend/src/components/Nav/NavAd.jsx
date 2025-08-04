// components/Nav/NavAd.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomProduct } from "../../services/api/products";
import { X, Sparkles, Star } from "lucide-react";

// 💡 Configurable settings
const REAPPEAR_INTERVAL = 600000; // 10 minutes
const CLOSE_COOLDOWN = 300000; // 5 minutes
const MAX_ADS_PER_SESSION = 5;
const INITIAL_DELAY = 10000; // 10 seconds

export default function NavAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [product, setProduct] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const adCountRef = useRef(0);       // Number of times ad has appeared
  const cooldownRef = useRef(false);  // Cooldown state flag
  const adTimerRef = useRef(null);    // Interval ref

  const fetchProduct = async () => {
    if (cooldownRef.current || adCountRef.current >= MAX_ADS_PER_SESSION) return;

    try {
      const randomProduct = await getRandomProduct();
      if (randomProduct) {
        setProduct(randomProduct);
        setIsVisible(true);
        adCountRef.current += 1;
      }
    } catch (error) {
      console.error("🚫 Failed to fetch product:", error);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 400);

    cooldownRef.current = true;
    setTimeout(() => {
      cooldownRef.current = false;
    }, CLOSE_COOLDOWN);
  };

  // 🧠 Handle ad lifecycle
  useEffect(() => {
    // Initial appearance after delay
    const initial = setTimeout(() => {
      if (!cooldownRef.current) fetchProduct();
    }, INITIAL_DELAY);

    // Loop interval
    adTimerRef.current = setInterval(() => {
      
      if (!isVisible && !isHovered && !cooldownRef.current) {
        fetchProduct();
      }
    }, REAPPEAR_INTERVAL);

    return () => {
      clearTimeout(initial);
      clearInterval(adTimerRef.current);
    };
  }, [isVisible, isHovered]);

  if (!isVisible || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9, rotateX: -15 }}
        animate={{
          opacity: isClosing ? 0 : 1,
          y: isClosing ? -30 : 0,
          scale: isClosing ? 0.9 : 1,
          rotateX: isClosing ? -15 : 0
        }}
        exit={{ opacity: 0, y: -30, scale: 0.9, rotateX: -15 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 100,
          damping: 18
        }}
        className="fixed right-4 top-20 z-[100] drop-shadow-xl"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 w-72 overflow-hidden"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{
            rotateY: isHovered ? 2 : 0,
            rotateX: isHovered ? -1 : 0,
            scale: isHovered ? 1.03 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          {/* Header */}
          <div className="relative p-4">
            <div className="flex justify-between items-start mb-3">
              <motion.div 
                className="flex items-center gap-1.5"
                animate={{ scale: isHovered ? 1.05 : 1 }}
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
                className="text-gray-400 hover:text-gray-600 transition-all hover:bg-gray-100 rounded-full p-1"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            </div>

            {/* Product Info */}
            <Link to={`/products/${product._id}`} className="group block">
              <div className="flex items-center gap-4">
                {/* Image */}
                <motion.div
                  className="relative"
                  animate={{ rotateY: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative bg-gray-100 rounded-xl w-20 h-20 overflow-hidden border-2 border-white shadow-lg">
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
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-white/60 rounded-bl-lg" />
                  </div>
                </motion.div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <motion.h3 
                    className="font-semibold text-sm text-gray-800 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all"
                    animate={{ x: isHovered ? 2 : 0 }}
                  >
                    {product.name}
                  </motion.h3>

                  <div className="flex items-center justify-between mt-2">
                    <motion.span
                      className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                      animate={{ scale: isHovered ? 1.05 : 1 }}
                    >
                      KES {product.price.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                    </motion.span>

                    {product.discountPercentage > 0 && (
                      <motion.span 
                        className="text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 px-2 py-1 rounded-full shadow"
                        animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
                      >
                        -{product.discountPercentage}%
                      </motion.span>
                    )}
                  </div>

                  <motion.div
                    className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ y: isHovered ? 0 : 5 }}
                  >
                    Click to view details →
                  </motion.div>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom pulse shimmer */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ originX: 0 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
