// AboutCTA.jsx
import { motion } from "framer-motion";
import { FiArrowRight, FiPhone } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";

const socials = [
  { Icon: FaFacebook, label: "Facebook", href: "#" },
  { Icon: FaTwitter, label: "Twitter", href: "#" },
  { Icon: FaLinkedin, label: "LinkedIn", href: "#" },
  { Icon: FaInstagram, label: "Instagram", href: "#" },
  { Icon: FaWhatsapp, label: "WhatsApp", href: "#" },
];

export default function AboutCTA() {
  return (
    <section className="relative py-20 sm:py-24 bg-primary overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">
            Ready to Power Your Business<br className="hidden sm:block" /> with Cutting-Edge IT?
          </h2>

          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Let's discuss how we can transform your technology infrastructure and drive your growth.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Today <FiArrowRight />
            </motion.a>
            <motion.a
              href="tel:+254733681921"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/60 hover:border-white transition-all"
            >
              <FiPhone /> Call Now
            </motion.a>
          </div>

          {/* Socials */}
          <div className="flex justify-center gap-3 flex-wrap">
            {socials.map(({ Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 flex items-center justify-center transition-all"
              >
                <Icon className="text-white w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
