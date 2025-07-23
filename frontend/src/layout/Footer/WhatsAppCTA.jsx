// /components/Layout/Footer/WhatsAppCTA.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 160; // adjust for footer height
      setIsNearFooter(scrollPosition >= threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className={`fixed z-50 transition-all duration-300 ${
        isNearFooter ? "left-6 bottom-6" : "right-6 bottom-6"
      }`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.a
        href="https://wa.me/254733681921"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaWhatsapp size={20} />
        <span>Chat with Us</span>
      </motion.a>
    </motion.div>
  );
}
