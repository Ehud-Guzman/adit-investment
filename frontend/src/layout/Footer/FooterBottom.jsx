import { motion } from "framer-motion";

export default function FooterBottom() {
  return (
    <div className="border-t border-gray-200 mt-12 pt-6 text-center">
      <motion.div
        className="text-gray-600 text-sm mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        © {new Date().getFullYear()} Adit Investment Ltd. All Rights Reserved.
      </motion.div>

      <motion.div
        className="text-sm text-gray-500"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Built by{" "}
        <motion.a
          href="https://glimmerink.co.ke"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700 font-semibold hover:text-green-800 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          GlimmerInk Creations
        </motion.a>
      </motion.div>
    </div>
  );
}
