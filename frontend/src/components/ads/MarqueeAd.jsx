// components/ads/MarqueeAd.jsx
import { motion } from 'framer-motion';

const MarqueeAd = () => {
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
    color: "from-teal-400 to-emerald-500",
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


      <div className="relative py-3 px-4">
        <div className="flex whitespace-nowrap overflow-hidden">
          {/* Single track with items doubled — animate to -50% for seamless loop */}
          <motion.div
            className="flex items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
            style={{ willChange: "transform" }}
          >
            {[...messages, ...messages].map((message, index) => (
              <div key={index} className="flex items-center mx-8">
                <span className="text-2xl mr-3">{message.icon}</span>
                <span className={`text-sm sm:text-base font-semibold bg-gradient-to-r ${message.color} bg-clip-text text-transparent tracking-wide`}>
                  {message.text}
                </span>
                <div className="mx-6 w-2 h-2 rounded-full bg-gradient-to-r from-white/40 to-white/20 flex-shrink-0" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Edge fade effects */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default MarqueeAd;