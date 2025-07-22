// AboutHero.jsx
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function AboutHero() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-white text-gray-900 border-b border-gray-100">
      <div className="container mx-auto relative z-10"> {/* Removed px classes */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
        >
          Driving{" "}
          <span className="text-primary">Tech Innovation</span> in East Africa
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mb-6"
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
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-md bg-primary text-white font-semibold shadow-md hover:bg-primary/90 transition-all text-sm sm:text-base"
          >
            Our Story
          </a>
          <a
            href="#team"
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-md border border-gray-300 hover:border-primary text-gray-700 hover:text-primary transition-all font-medium text-sm sm:text-base"
          >
            Meet the Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}