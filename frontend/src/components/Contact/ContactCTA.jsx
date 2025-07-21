// components/contact/ContactCTA.jsx
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function ContactCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-20 px-6 sm:px-12 bg-gradient-to-r from-cyan-700/50 to-blue-800/40 border border-cyan-600/20 rounded-xl shadow-xl text-white text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Still have questions?
      </h2>
      <p className="text-lg text-gray-200 mb-8">
        We're happy to help — drop us a message and we’ll get back ASAP.
      </p>
      <a
        href="#contact-form"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-md transition-all"
      >
        Contact Us <FiArrowRight className="ml-2" />
      </a>
    </motion.section>
  );
}
