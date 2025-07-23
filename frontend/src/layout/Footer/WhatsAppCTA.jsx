// /components/Layout/Footer/WhatsAppCTA.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight;
      const pageHeight = document.body.offsetHeight;
      const buffer = 200; // distance from bottom to start rotating
      setIsVertical(scrollY >= pageHeight - buffer);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed z-50 bottom-6 right-6 origin-bottom-right"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <motion.a
        href="https://wa.me/254733681921"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${
          isVertical ? "rotate-90 origin-right" : ""
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          transformOrigin: isVertical ? "bottom right" : "center",
          minWidth: isVertical ? "140px" : "auto",
        }}
      >
        <FaWhatsapp size={20} />
        <span className={`${isVertical ? "whitespace-nowrap" : ""}`}>
          Chat with Us
        </span>
      </motion.a>
    </motion.div>
  );
}
