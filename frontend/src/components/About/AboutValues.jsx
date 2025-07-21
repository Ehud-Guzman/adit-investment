import { motion } from "framer-motion";

const values = [
  {
    title: "Innovation",
    description: "We constantly explore new technologies to deliver future-proof solutions.",
    color: "cyan",
    border: "border-cyan-400",
    bgBlur: "bg-cyan-500/10",
    text: "text-cyan-600"
  },
  {
    title: "Integrity",
    description: "Honest advice and transparent pricing—no hidden costs or surprises.",
    color: "blue",
    border: "border-blue-400",
    bgBlur: "bg-blue-500/10",
    text: "text-blue-600"
  },
  {
    title: "Excellence",
    description: "From consultation to implementation, we deliver premium quality.",
    color: "purple",
    border: "border-purple-400",
    bgBlur: "bg-purple-500/10",
    text: "text-purple-600"
  }
];

export default function AboutValues() {
  return (
    <section className="relative py-20 px-6 sm:px-10 lg:px-20 bg-white text-gray-900 border-t border-gray-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ✨ Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-sm">
            Our Core Values
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            The beliefs that drive how we think, create, and deliver.
          </p>
        </motion.div>

        {/* 🧩 Value Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white border-t-4 ${value.border} rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden p-7 md:p-8`}
            >
              {/* Glow Effect */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${value.bgBlur} blur-2xl`} />

              {/* Badge */}
              <div
                className={`w-12 h-12 mb-6 flex items-center justify-center text-lg font-bold rounded-full ${value.bgBlur} ${value.text}`}
              >
                {i + 1}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-3">{value.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
