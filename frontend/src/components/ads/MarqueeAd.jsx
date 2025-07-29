// components/ads/MarqueeAd.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MarqueeAd = () => {
  const [isHovered, setIsHovered] = useState(false);

 const messages = [
  {
    icon: "💻",
    text: "Web Development, UX/UI, and Software Installations",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: "🔧",
    text: "PC Repairs & Custom Software Solutions",
    color: "from-rose-400 to-red-400",
  },
  {
    icon: "🖨️",
    text: "Laptop, Printer & ICT Equipment Sales",
    color: "from-teal-400 to-emerald-400",
  },
  {
    icon: "🚀",
    text: "Fast, Reliable, Affordable ICT Solutions",
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: "💡",
    text: "Discover ADIT's Smart Office Packages",
    color: "from-amber-400 to-orange-400",
  },
  {
    icon: "📦",
    text: "Free Consultations for Bulk Purchases",
    color: "from-emerald-400 to-green-400",
  },
  {
    icon: "🔒",
    text: "CCTV Installations – Book Now!",
    color: "from-purple-400 to-pink-400",
  },
];


  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg border-y border-white/10">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: "200% 100%"
        }}
      />

      {/* Subtle particle effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [-10, window.innerWidth + 10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.8,
            }}
            style={{
              top: `${20 + i * 8}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative py-3 px-4"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex whitespace-nowrap">
          {/* First marquee instance */}
          <motion.div
            className="flex items-center"
            animate={{
              x: [0, -100 * messages.length * 6], // Adjust based on content width
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {messages.map((message, index) => (
              <div key={`first-${index}`} className="flex items-center mx-8">
                <motion.span
                  className="text-2xl mr-3"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  {message.icon}
                </motion.span>
                <span className={`text-sm sm:text-base font-semibold bg-gradient-to-r ${message.color} bg-clip-text text-transparent tracking-wide`}>
                  {message.text}
                </span>
                <div className="mx-6 w-2 h-2 rounded-full bg-gradient-to-r from-white/40 to-white/20" />
              </div>
            ))}
          </motion.div>

          {/* Second marquee instance for seamless loop */}
          <motion.div
            className="flex items-center"
            animate={{
              x: [0, -100 * messages.length * 6],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {messages.map((message, index) => (
              <div key={`second-${index}`} className="flex items-center mx-8">
                <motion.span
                  className="text-2xl mr-3"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  {message.icon}
                </motion.span>
                <span className={`text-sm sm:text-base font-semibold bg-gradient-to-r ${message.color} bg-clip-text text-transparent tracking-wide`}>
                  {message.text}
                </span>
                <div className="mx-6 w-2 h-2 rounded-full bg-gradient-to-r from-white/40 to-white/20" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Subtle glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
            scaleY: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Edge fade effects */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default MarqueeAd;