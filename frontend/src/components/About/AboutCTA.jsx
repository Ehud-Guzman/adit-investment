import { motion } from "framer-motion";
import { FiArrowRight, FiPhone } from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function AboutCTA() {
  return (
    <section className="w-full relative py-24 sm:py-28 px-0 md:px-8 lg:px-16 xl:px-20 bg-white text-gray-900 border-t border-gray-200">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
        >
          Ready to Power Your Business with Cutting-Edge IT?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Let's discuss how we can transform your technology infrastructure.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <motion.a
            href="/contact"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            Get Started Today <FiArrowRight />
          </motion.a>
          <motion.a
            href="tel:+254733681921"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 hover:border-primary text-gray-800 hover:text-primary rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <FiPhone /> Call Now
          </motion.a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center mt-10 sm:mt-12 gap-3 sm:gap-4 flex-wrap">
          {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp].map(
            (Icon, i) => (
              <motion.a
                key={i}
                href="#"
                aria-label={`Visit our ${Icon.name} page`}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted hover:bg-primary/10 text-primary border border-gray-200 flex items-center justify-center transition-all"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            )
          )}
        </div>
      </div>
    </section>
  );
}
