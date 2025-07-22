import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function ContactCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-12 px-6 sm:px-12 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl text-white text-center mt-16"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        Still have questions?
      </h2>
      <p className="text-lg text-cyan-100 mb-8 max-w-2xl mx-auto">
        We're happy to help — drop us a message and we'll get back ASAP.
      </p>
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="#contact-form"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-cyan-700 font-semibold shadow-md transition-all"
      >
        Contact Us <FiArrowRight className="ml-2" />
      </motion.a>
    </motion.section>
  );
}