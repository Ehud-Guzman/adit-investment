// /components/Layout/Footer/FooterServices.jsx
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const services = [
  "Web Development",
  "IT Repair",
  "Cloud Hosting",
  "Database Solutions",
  "Network Solutions",
  "Tech Consultancy",
];

export default function FooterServices() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Our Services</h3>
      <ul className="space-y-2">
        {services.map((service) => (
          <motion.li
            key={service}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <a
              href="#"
              className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
            >
              <FiArrowUpRight size={14} className="text-green-600" />
              <span>{service}</span>
            </a>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
