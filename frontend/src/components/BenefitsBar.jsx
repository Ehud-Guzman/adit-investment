import { motion } from "framer-motion";
import { FiTruck, FiShield, FiClock, FiCreditCard } from "react-icons/fi";

const BENEFITS = [
  { icon: FiTruck, text: "Free shipping on orders over KSh 100,000" },
  { icon: FiShield, text: "Free Expert Guide" },
  { icon: FiClock, text: "Same-day dispatch for orders before 3PM" },
  { icon: FiCreditCard, text: "Secure payment processing" },
];

const BenefitsBar = () => (
  <div className="mt-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="region" aria-label="Benefits">
    {BENEFITS.map(({ icon: Icon, text }, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 + index * 0.08, duration: 0.35 }}
        className="bg-white p-3 sm:p-4 rounded-xl shadow-sm flex items-center gap-3 border border-gray-100"
      >
        <div className="bg-blue-50 p-2.5 rounded-full flex-shrink-0">
          <Icon className="text-blue-500" size={18} aria-hidden="true" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-gray-700 leading-snug">
          {text}
        </span>
      </motion.div>
    ))}
  </div>
);

export default BenefitsBar;
