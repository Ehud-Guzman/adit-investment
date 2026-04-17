// AboutStats.jsx
import { motion } from "framer-motion";
import { FiUsers, FiTrendingUp, FiAward, FiGlobe } from "react-icons/fi";

const stats = [
  { value: "100+", label: "Clients Served", icon: FiUsers },
  { value: "9+", label: "Years in Business", icon: FiTrendingUp },
  { value: "150+", label: "Projects Completed", icon: FiAward },
  { value: "East Africa", label: "Regional Presence", icon: FiGlobe },
];

export default function AboutStats() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-white mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-white/75 text-sm font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
