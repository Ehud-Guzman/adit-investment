import { motion } from "framer-motion";
import { FiPhone, FiActivity } from "react-icons/fi";

export default function FooterBottom() {
  return (
    <div className="border-t border-gray-200 mt-12 pt-6 text-center">
      {/* Copyright */}
      <motion.div
        className="text-gray-600 text-sm mb-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        © {new Date().getFullYear()} Adit Investment Ltd. All Rights Reserved.
      </motion.div>

      {/* Dev Credit */}
      <motion.div
        className="flex flex-col md:flex-row justify-center items-center gap-3 text-sm text-gray-500"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="italic">Website built with</span>

        <motion.span
          className="text-red-500 flex items-center gap-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FiActivity className="text-green-800" />
        </motion.span>

        <span className="italic">by</span>

        <motion.a
          href="https://glimmerink.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700 font-semibold hover:text-green-800 transition-colors"
          whileHover={{ scale: 1.08 }}
        >
          GlimmerInk Creations
        </motion.a>

        <span className="hidden md:inline">|</span>

        <motion.a
          href="tel:+254746527253"
          className="text-green-700 font-medium hover:text-green-800 flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          <FiPhone size={12} />
          <span>+254 746 527 253</span>
        </motion.a>

        <span className="hidden md:inline">|</span>

        <motion.a
          href="mailto:nyamuehud@gmail.com"
          className="text-green-700 hover:text-green-800 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          nyamuehud@gmail.com
        </motion.a>
      </motion.div>
    </div>
  );
}
