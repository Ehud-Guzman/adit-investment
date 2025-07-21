import { useState } from "react";
import {
  FiShoppingBag,
  FiMonitor,
  FiPrinter,
  FiHeadphones,
  FiCpu,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: <FiMonitor className="text-primary text-xl" />,
    label: "Laptops & Monitors",
    details: "i5 / i7 • SSD • Full HD",
    img: "/assets/images/services/laptop sales.jpg",
    badge: "Editor’s Pick",
  },
  {
    icon: <FiCpu className="text-accent text-xl" />,
    label: "System Units",
    details: "High-end CPUs • Compact Towers",
    img: "/assets/images/hp-desktop-pro-6300.jpg",
    badge: "Office & Home Ready",
  },
  {
    icon: <FiPrinter className="text-pink-500 text-xl" />,
    label: "Printers",
    details: "Inkjet • Toners • Wireless",
    img: "/assets/images/Epson-L3250.webp",
    badge: "Top Seller",
  },
  {
    icon: <FiHeadphones className="text-blue-400 text-xl" />,
    label: "Audio Gear",
    details: "Studio Sound • Wireless",
    img: "/assets/images/headphones.jpg",
    badge: "Staff Favorite",
  },
];

export default function ProductPromoSectionPro() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white text-center rounded-2xl border border-white/10 py-14 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto mt-24 mb-16 shadow-xl overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('/assets/images/pattern.svg')] bg-cover bg-center pointer-events-none" />

      <div className="relative z-10">
        {/* Top Badge */}
        <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm text-white/80 mb-5 border border-white/20">
          🔥 Popular Right Now
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight drop-shadow-md">
          Explore Our <span className="text-accent">Premium ICT Products</span>
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed">
          Carefully selected computing essentials — from high-performance systems to studio-grade peripherals.
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center mb-12">
          {categories.map(({ icon, label, details, img, badge }, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.04 }}
              className="relative flex flex-col items-center gap-1 px-5 py-6 rounded-xl border backdrop-blur-md transition-all duration-300 bg-white/10 hover:bg-white/15 border-white/15 cursor-pointer"
            >
              {/* Icon or Image */}
              <div className="h-14 w-14 relative mb-2">
                <AnimatePresence mode="wait">
                  {hoveredIndex === i ? (
                    <motion.img
                      key="img"
                      src={img}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full object-contain rounded-md shadow-md bg-white/10 border border-white/10"
                    />
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {icon}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Labels */}
              <span className="text-sm text-white/90 font-medium">{label}</span>
              <span className="text-[11px] text-white/60 leading-tight">{details}</span>
              <span className="text-[10px] text-accent mt-1">{badge}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-white text-primary hover:text-accent hover:bg-white/90 transition-all px-6 py-3 rounded-full font-semibold border-2 border-white shadow hover:shadow-lg text-sm"
          >
            <FiShoppingBag className="text-lg" />
            <span>Browse Products</span>
          </Link>
        </motion.div>

        {/* Trust Points */}
        <ul className="flex justify-center flex-wrap gap-4 text-xs text-white/50 mt-6">
          <li className="flex items-center gap-1">🚚 Fast Delivery</li>
          <li className="flex items-center gap-1">🔐 Secure Checkout</li>
          <li className="flex items-center gap-1">🌍 Trusted Locally</li>
        </ul>
      </div>
    </section>
  );
}
