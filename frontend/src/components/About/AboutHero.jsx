import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function AboutHero() {
  return (
    <section className="relative py-20 sm:py-24 px-0 md:px-8 lg:px-16 xl:px-20 bg-white text-gray-900 overflow-hidden border-b border-gray-100">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
        >
          Driving{" "}
          <span className="text-primary">Tech Innovation</span> in East Africa
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6"
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
            className="px-6 py-3 rounded-md bg-primary text-white font-semibold shadow-md hover:bg-primary/90 transition-all"
          >
            Our Story
          </a>
          <a
            href="#team"
            className="px-6 py-3 rounded-md border border-gray-300 hover:border-primary text-gray-700 hover:text-primary transition-all font-medium"
          >
            Meet the Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
