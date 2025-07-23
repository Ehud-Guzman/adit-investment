// /components/Layout/Footer/WhatsAppCTA.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  const [showIconOnly, setShowIconOnly] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight;
      const pageHeight = document.body.offsetHeight;
      const buffer = 180; // Distance from bottom to start collapsing
      setShowIconOnly(scrollY >= pageHeight - buffer);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed z-50 bottom-6 right-6"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <motion.a
        href="https://wa.me/254733681921"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 bg-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300
          ${showIconOnly ? "p-3 w-12 h-12" : "px-5 py-3"}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={20} />
        {!showIconOnly && <span className="text-sm font-medium">Chat with Us</span>}
      </motion.a>
    </motion.div>
  );
}
