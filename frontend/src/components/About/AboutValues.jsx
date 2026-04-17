// AboutValues.jsx
import { motion } from "framer-motion";
import { FiZap, FiShield, FiStar } from "react-icons/fi";

const values = [
  {
    icon: FiZap,
    title: "Innovation",
    description:
      "We constantly explore new technologies to deliver future-proof solutions that keep your business ahead of the curve.",
    accent: "primary",
  },
  {
    icon: FiShield,
    title: "Integrity",
    description:
      "Honest advice and transparent pricing — no hidden costs, no surprises. Your trust is the foundation of everything.",
    accent: "accent",
  },
  {
    icon: FiStar,
    title: "Excellence",
    description:
      "From consultation to implementation, we hold ourselves to the highest standards of quality and professionalism.",
    accent: "secondary",
  },
];

const accentMap = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary",
    glow: "bg-primary/10",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent",
    glow: "bg-accent/10",
  },
  secondary: {
    bg: "bg-secondary/20",
    text: "text-yellow-600",
    border: "border-secondary",
    glow: "bg-secondary/10",
  },
};

export default function AboutValues() {
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
            Our Core <span className="text-primary">Values</span>
          </h2>
          <p className="text-textLight max-w-xl mx-auto">
            The beliefs that drive how we think, create, and deliver.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {values.map((v, i) => {
            const a = accentMap[v.accent];
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-muted rounded-2xl p-8 border-t-4 ${a.border} shadow-sm hover:shadow-lg transition-all overflow-hidden`}
              >
                {/* Glow */}
                <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full ${a.glow} blur-2xl pointer-events-none`} />

                <div className={`w-12 h-12 rounded-xl ${a.bg} ${a.text} flex items-center justify-center mb-6 relative z-10`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-dark mb-3 relative z-10">{v.title}</h3>
                <p className="text-textLight text-sm leading-relaxed relative z-10">{v.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
