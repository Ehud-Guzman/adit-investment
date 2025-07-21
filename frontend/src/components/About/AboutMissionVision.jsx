import { motion } from "framer-motion";

export default function AboutMissionVision() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white text-gray-900 border-y border-gray-100">
      {/* Optional background pattern */}
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] bg-repeat opacity-5 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 px-2"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
            Our Core Beliefs
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Guiding principles that drive everything we do
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:gap-12 grid-cols-1 md:grid-cols-2">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border-l-4 border-primary/80 w-full break-words"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Mission</h3>
            <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed">
              To deliver innovative, reliable, and affordable ICT solutions that empower businesses to thrive in the digital economy.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-1 bg-primary/80"></div>
              <span className="text-sm font-medium text-gray-500">Delivering excellence daily</span>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border-l-4 border-blue-500/80 w-full break-words"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Vision</h3>
            <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed">
              To be East Africa's most trusted technology partner, transforming businesses through cutting-edge digital solutions.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-1 bg-blue-500/80"></div>
              <span className="text-sm font-medium text-gray-500">Building the future</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
