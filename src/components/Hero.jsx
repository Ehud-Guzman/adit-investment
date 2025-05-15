import { motion } from 'framer-motion';
import { FiArrowRight, FiPhoneCall } from 'react-icons/fi';

export default function Hero() {
  // Safaricom green (#007A3D) and tech blue (#0056B3)
  const colors = {
    primary: '#007A3D', // Safaricom green
    secondary: '#0056B3', // Tech blue
    light: '#E6F2FF',
    dark: '#0A2540',
  };

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`
        }}
      >
        {/* Animated tech pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <motion.path
              fill="#fff"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
        
        {/* Floating tech elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-opacity-20 border-white"
              initial={{
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0
              }}
              animate={{
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                opacity: 0.1
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100 - 20}%`,
                left: `${Math.random() * 100 - 20}%`,
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-32 md:py-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Premium ICT Equipment
            </span>
            <br />
            <span 
              className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, #00C853 100%)`
              }}
            >
              & Digital Solutions
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Cutting-edge technology from global brands at competitive prices.
            Enterprise-grade solutions for businesses and professionals.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.a
              href="#products"
              className="group relative overflow-hidden px-8 py-4 rounded-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
              }}
            >
              <span className="relative z-10 flex items-center justify-center">
                Shop Now <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </motion.a>

            <motion.a
              href="/contact"
              className="group relative overflow-hidden px-8 py-4 rounded-lg font-semibold shadow-lg border-2 border-white border-opacity-20 hover:border-opacity-40 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center justify-center text-white">
                <FiPhoneCall className="mr-2" /> Contact Sales
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating animated indicators */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-8 h-8 text-white opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}