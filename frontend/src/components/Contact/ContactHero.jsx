// components/contact/ContactHero.jsx
import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 text-center bg-gradient-to-br from-gray-50 via-white to-gray-100 border-b border-gray-200">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900"
      >
        Let's Get in Touch
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg text-gray-600 max-w-xl mx-auto"
      >
        Have questions, ideas, or just need a quick hello? Drop us a message and we’ll be with you shortly.
      </motion.p>
    </section>
  );
}
