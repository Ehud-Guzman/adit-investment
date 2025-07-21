import { motion } from "framer-motion";
import { FiTruck, FiShield, FiClock, FiCreditCard } from "react-icons/fi";

const BENEFITS = [
  { icon: <FiTruck className="text-blue-500" aria-hidden="true" />, text: "Free shipping on orders over KSh 100,000" },
  { icon: <FiShield className="text-blue-500" aria-hidden="true" />, text: "Free Expert Guide" },
  { icon: <FiClock className="text-blue-500" aria-hidden="true" />, text: "Same-day dispatch for orders before 3PM" },
  { icon: <FiCreditCard className="text-blue-500" aria-hidden="true" />, text: "Secure payment processing" },
];

const BenefitsBar = () => (
  <div className="mt-8   grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 sm:mb-12" role="region" aria-label="Benefits section">
    {BENEFITS.map((benefit, index) => (
      <motion.div
        key={index}
       
        className="bg-white p-3 sm:p-4 rounded-xl shadow-sm flex items-center gap-3 sm:gap-4 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-700"
       
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.1 }}
      >
        <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
          {benefit.icon}
        </div>
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          {benefit.text}
        </span>
      </motion.div>
    ))}
  </div>
);

export default BenefitsBar;