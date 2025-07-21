import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function AboutHero() {
  return (
<section className="relative py-20 px-6 bg-white text-gray-900 overflow-hidden border-b border-gray-100">
  <div className="max-w-5xl mx-auto relative z-10 text-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-3xl md:text-5xl font-bold mb-4"
    >
      Driving <span className="text-primary">Tech Innovation</span> in East Africa
    </motion.h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-gray-600 text-lg max-w-2xl mx-auto mb-6"
    >
      Empowering businesses with tailored ICT solutions since 2018.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex flex-wrap justify-center gap-3"
    >
      <a
        href="#story"
        className="px-6 py-3 rounded-md bg-primary text-white font-medium shadow-sm hover:bg-primary/90 transition"
      >
        Our Story
      </a>
      <a
        href="#team"
        className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition"
      >
        Meet the Team
      </a>
    </motion.div>
  </div>
</section>

  );
}
