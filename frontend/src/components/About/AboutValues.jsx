// AboutValues.jsx
import { motion } from "framer-motion";

const values = [
  {
    title: "Innovation",
    description:
      "We constantly explore new technologies to deliver future-proof solutions.",
    border: "border-cyan-400",
    bgBlur: "bg-cyan-500/10",
    text: "text-cyan-600",
  },
  {
    title: "Integrity",
    description:
      "Honest advice and transparent pricing—no hidden costs or surprises.",
    border: "border-blue-400",
    bgBlur: "bg-blue-500/10",
    text: "text-blue-600",
  },
  {
    title: "Excellence",
    description:
      "From consultation to implementation, we deliver premium quality.",
    border: "border-purple-400",
    bgBlur: "bg-purple-500/10",
    text: "text-purple-600",
  },
];

export default function AboutValues() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-white text-gray-900 border-t border-gray-100">
      {/* BG Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none z-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-sm">
            Our Core Values
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            The beliefs that drive how we think, create, and deliver.
          </p>
        </motion.div>

        {/* Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className={`relative bg-white border-t-4 ${value.border} rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden p-5 sm:p-6`}
            >
              {/* Glow Effect */}
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${value.bgBlur} blur-2xl z-0`}
              />

              {/* Index Badge */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 mb-4 z-10 relative flex items-center justify-center text-lg font-bold rounded-full ${value.bgBlur} ${value.text}`}
              >
                {i + 1}
              </div>

              <h3 className="text-lg font-semibold mb-2 relative z-10">
                {value.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}