// AboutHero.jsx
import { motion } from "framer-motion";
import { FiArrowRight, FiUsers } from "react-icons/fi";

export default function AboutHero() {
  return (
    <section className="relative py-24 sm:py-28 md:py-32 bg-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-28 -left-28 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-5 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full tracking-wide"
        >
          Who We Are
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark mb-6 leading-tight"
        >
          Driving{" "}
          <span className="text-primary">Tech Innovation</span>
          <br className="hidden sm:block" /> in East Africa
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-textLight max-w-2xl mx-auto mb-10"
        >
          Empowering businesses with tailored ICT solutions since 2018 — from
          Busia, Kenya to the wider East African region.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#story"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
          >
            Our Story <FiArrowRight />
          </a>
          <a
            href="#team"
            className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-gray-200 hover:border-primary text-dark hover:text-primary font-semibold rounded-xl transition-colors"
          >
            <FiUsers className="w-4 h-4" /> Meet the Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
