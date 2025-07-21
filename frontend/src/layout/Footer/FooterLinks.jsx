// /components/Layout/Footer/FooterLinks.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const quickLinks = ["Home", "Products", "Services", "About", "Contact", "Admin"];

export default function FooterLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
      <ul className="space-y-2">
        {quickLinks.map((link) => (
          <motion.li
            key={link}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to={`/${link.toLowerCase()}`}
              className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
            >
              <FiArrowUpRight size={14} className="text-green-600" />
              <span>{link}</span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
