// components/ads/PromoBadge.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap } from 'lucide-react';

const PromoBadge = ({ 
  text = "🔥 Deal of the Week", 
  position = "top-4 right-4",
  variant = "fire", // fire, star, lightning, sparkle
  autoHide = false,
  hideDelay = 8000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay]);

  const variants = {
    fire: {
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      shadowColor: "shadow-red-500/30",
      icon: "🔥",
      particles: { color: "from-red-400 to-orange-400", count: 6 }
    },
    star: {
      gradient: "from-purple-500 via-pink-500 to-indigo-500",
      shadowColor: "shadow-purple-500/30",
      icon: <Star size={12} className="fill-white text-white" />,
      particles: { color: "from-purple-400 to-pink-400", count: 8 }
    },
    lightning: {
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      shadowColor: "shadow-blue-500/30",
      icon: <Zap size={12} className="fill-white text-white" />,
      particles: { color: "from-blue-400 to-cyan-400", count: 5 }
    },
    sparkle: {
      gradient: "from-amber-500 via-yellow-500 to-orange-500",
      shadowColor: "shadow-amber-500/30",
      icon: <Sparkles size={12} className="text-white" />,
      particles: { color: "from-amber-400 to-yellow-400", count: 7 }
    }
  };

  const currentVariant = variants[variant] || variants.fire;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`absolute ${position} z-30 cursor-pointer select-none`}
        initial={{ 
          opacity: 0, 
          scale: 0.8, 
          rotate: -10,
          y: 20 
        }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotate: 0,
          y: 0 
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.8, 
          rotate: 10,
          y: -20 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          duration: 0.6 
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsVisible(false)}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {[...Array(currentVariant.particles.count)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${currentVariant.particles.color} rounded-full opacity-60`}
              animate={{
                x: [0, Math.cos(i * 60) * 15, 0],
                y: [0, Math.sin(i * 60) * 15, 0],
                opacity: [0.6, 1, 0.6],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              style={{
                left: "50%",
                top: "50%",
              }}
            />
          ))}
        </div>

        {/* Main badge */}
        <motion.div
          className={`relative bg-gradient-to-r ${currentVariant.gradient} text-white text-xs sm:text-sm px-4 py-2 rounded-full shadow-xl ${currentVariant.shadowColor} backdrop-blur-sm border border-white/20 overflow-hidden`}
          animate={{
            scale: isHovered ? 1.05 : 1,
            boxShadow: isHovered 
              ? "0 20px 40px -12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Animated background shine */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: isHovered ? ["-100%", "100%"] : "-100%",
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />

          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative flex items-center gap-2 font-semibold tracking-wide">
            <motion.span
              className="text-base"
              animate={{
                rotate: typeof currentVariant.icon === 'string' ? [0, 15, -15, 0] : 0,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {currentVariant.icon}
            </motion.span>
            
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              {text.replace(/🔥|⭐|⚡|✨/g, '').trim()}
            </motion.span>
          </div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-full"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Floating ring indicator */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.5,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBadge;