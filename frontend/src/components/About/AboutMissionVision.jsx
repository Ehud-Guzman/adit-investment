// AboutMissionVision.jsx
import { motion } from "framer-motion";
import { FiTarget, FiEye } from "react-icons/fi";

export default function AboutMissionVision() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-3">
            Our Core <span className="text-primary">Beliefs</span>
          </h2>
          <p className="text-textLight max-w-xl mx-auto">
            Guiding principles that drive everything we do
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-muted rounded-2xl p-8 border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
              <FiTarget className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">Mission</h3>
            <p className="text-textLight leading-relaxed mb-6">
              To deliver innovative, reliable, and affordable ICT solutions that
              empower businesses to thrive in the digital economy.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-primary rounded-full" />
              <span className="text-sm text-textLight font-medium">Delivering excellence daily</span>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-muted rounded-2xl p-8 border-l-4 border-accent shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
              <FiEye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">Vision</h3>
            <p className="text-textLight leading-relaxed mb-6">
              To be East Africa's most trusted technology partner, transforming
              businesses through cutting-edge digital solutions.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-accent rounded-full" />
              <span className="text-sm text-textLight font-medium">Building the future</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
