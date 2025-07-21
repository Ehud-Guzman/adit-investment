import { motion } from "framer-motion";
import { FiUsers, FiTrendingUp, FiAward, FiGlobe } from "react-icons/fi";

const stats = [
  { id: 1, value: "100+", label: "Clients Served", icon: FiUsers },
  { id: 2, value: "9+", label: "Years in Business", icon: FiTrendingUp },
  { id: 3, value: "150+", label: "Projects Completed", icon: FiAward },
  { id: 4, value: "East Africa", label: "Regional Presence", icon: FiGlobe },
];

export default function AboutStats() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white text-gray-900 border-y border-gray-100">
      {/* Optional background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all text-center border border-gray-100"
              >
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-cyan-100 text-cyan-700">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-extrabold mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-base font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
