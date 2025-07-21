// /components/Home/ServiceSection/ServiceCard.jsx
import { motion } from 'framer-motion';

export default function ServiceCard({
  title,
  icon,
  description,
  features,
}) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all 
                 bg-gradient-to-br from-white via-white to-primary/10"
    >
      <div className="p-8">
        {/* Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-md">
          {icon}
        </div>

        {/* Title */}
        <h4 className="text-xl font-bold text-dark mb-4">{title}</h4>

        {/* Description */}
        <p className="text-base text-text mb-6">{description}</p>

        {/* Feature List */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-text">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
