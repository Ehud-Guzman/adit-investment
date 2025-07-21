// /components/Layout/Footer/FooterContact.jsx
import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

export default function FooterContact() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
      <ul className="space-y-3 text-gray-600">
        <motion.li className="flex items-start gap-3" whileHover={{ x: 3 }}>
          <FiMapPin className="mt-1 text-green-600" />
          <div>
            <p>Busia County, Kenya</p>
            <p>Bondo Town, Kenya</p>
          </div>
        </motion.li>

        <motion.li className="flex items-start gap-3" whileHover={{ x: 3 }}>
          <FiPhone className="text-green-600" />
          <div>
            <a
              href="tel:+254733681921"
              className="hover:text-green-700 block transition"
            >
              +254 733 681 921
            </a>
            <a
              href="tel:+254704746482"
              className="hover:text-green-700 block transition"
            >
              +254 704 746 482
            </a>
          </div>
        </motion.li>

        <motion.li className="flex items-start gap-3" whileHover={{ x: 3 }}>
          <FiMail className="text-green-600" />
          <a
            href="mailto:info@aditinvestment.com"
            className="hover:text-green-700 transition"
          >
            info@aditinvestment.com
          </a>
        </motion.li>

        <motion.li className="flex items-start gap-3" whileHover={{ x: 3 }}>
          <FiClock className="text-green-600" />
          <span>Mon-Sat: 8AM - 7PM</span>
        </motion.li>
      </ul>
    </div>
  );
}
