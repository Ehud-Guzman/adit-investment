// /components/Layout/Footer/FooterBrand.jsx
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const socialIcons = [
  { icon: <FaFacebook />, color: "#1877f2" },
  { icon: <FaTwitter />, color: "#1da1f2" },
  { icon: <FaLinkedin />, color: "#0077b5" },
  { icon: <FaInstagram />, color: "#e4405f" },
  { icon: <FaWhatsapp />, color: "#25d366" },
];

export default function FooterBrand() {
  return (
    <div className="space-y-4">
      <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
        <img
          src="/assets/images/services/logo.jpg"
          alt="Adit Investment Logo"
          className="w-10 h-10 object-contain bg-white p-1 rounded-lg border"
        />
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 via-primary to-emerald-500 text-transparent bg-clip-text">
          Adit Investment
        </h3>
      </motion.div>

      <p className="text-gray-600 text-sm leading-relaxed">
        "Empowering businesses through innovative technology solutions and cutting-edge digital transformation."
      </p>

      <div className="flex gap-3">
        {socialIcons.map((social, i) => (
          <motion.a
            key={i}
            href="#"
            className="text-gray-500 hover:text-white p-2 rounded-full transition-colors"
            whileHover={{ scale: 1.1, color: "white", backgroundColor: social.color }}
            whileTap={{ scale: 0.9 }}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
