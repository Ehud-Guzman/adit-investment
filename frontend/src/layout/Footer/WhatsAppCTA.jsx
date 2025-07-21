// /components/Layout/Footer/WhatsAppCTA.jsx
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  return (
    <motion.div
      className="fixed right-6 bottom-6 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.a
        href="https://wa.me/254733681921"
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
