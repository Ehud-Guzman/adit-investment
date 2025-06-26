import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiArrowUpRight,
} from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  const canvasRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const footerRef = useRef(null);

  // Techy gradient colors
  const colors = {
    primary: "#00f2c3",
    secondary: "#0098f0",
    accent: "#6e45e2",
    dark: "#0f172a",
    light: "#f8fafc",
  };

  useEffect(() => {
    // Particle animation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 400;

    const particlesArray = [];
    const numberOfParticles = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? colors.primary : colors.secondary;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        this.alpha = Math.sin(Date.now() * 0.002 + this.x) * 0.2 + 0.2;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let particle of particlesArray) {
        particle.update();
        particle.draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  const quickLinks = [
    "Home",
    "Products",
    "Services",
    "About",
    "Contact",
    "Admin",
  ];
  const services = [
    "Web Development",
    "IT Repair",
    "Cloud Hosting",
    "Database Solutions",
    "Network Solutions",
    "Tech Consultancy",
  ];
  const socialIcons = [
    { icon: <FaFacebook />, color: "#1877f2" },
    { icon: <FaTwitter />, color: "#1da1f2" },
    { icon: <FaLinkedin />, color: "#0077b5" },
    { icon: <FaInstagram />, color: "#e4405f" },
    { icon: <FaWhatsapp />, color: "#25d366" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative py-16 overflow-hidden border-t border-gray-800/50"
      style={{
        background: `linear-gradient(135deg, ${colors.dark} 0%, #0a1a2e 100%)`,
      }}
    >
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
      />

      {/* Main footer content */}
      <motion.div
        className="relative container mx-auto px-4 z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Logo & Company Info */}
          <div className="space-y-6">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 opacity-75 blur"></div>
                <div className="relative bg-white p-2 rounded-lg">
                  <img
                    src="/assets/images/services/logo.jpg"
                    alt="Adit Investment Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Adit Investment
              </h3>
            </motion.div>

            <p className="text-gray-400 text-sm leading-relaxed">
              "Empowering businesses through innovative technology solutions and
              cutting-edge digital transformation."
            </p>

            <div className="flex gap-4">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
                  whileHover={{
                    scale: 1.1,
                    color: social.color,
                    background: "rgba(255,255,255,0.1)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links - Updated hover effect */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 w-1 h-6 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li
                  key={link}
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <motion.span
                      animate={{
                        opacity: hoveredItem === `link-${link}` ? 1 : 0.7,
                      }}
                    >
                      <FiArrowUpRight size={14} className="text-cyan-400" />
                    </motion.span>
                    <span className="group-hover:text-cyan-300 transition-colors">
                      {link}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Services - Updated hover effect */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 w-1 h-6 rounded-full"></span>
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <motion.li
                  key={service}
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href="#"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <motion.span
                      animate={{
                        opacity: hoveredItem === `service-${service}` ? 1 : 0.7,
                      }}
                    >
                      <FiArrowUpRight size={14} className="text-cyan-400" />
                    </motion.span>
                    <span className="group-hover:text-cyan-300 transition-colors">
                      {service}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 w-1 h-6 rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-4 text-gray-400">
              <motion.li
                className="flex items-start gap-3 group"
                whileHover={{ x: 5 }}
              >
                <FiMapPin className="mt-1 text-cyan-400" />
                <span className="group-hover:text-cyan-300 transition-colors">
                  Busia County, Kenya
                </span>
              </motion.li>
              <motion.li
                className="flex items-center gap-3 group"
                whileHover={{ x: 5 }}
              >
                <FiPhone className="text-cyan-400" />
                <div>
                  <a
                    href="tel:+254733681921"
                    className="hover:text-cyan-300 transition-colors block"
                  >
                    +254 733 681 921
                  </a>
                  <a
                    href="tel:+254704746482"
                    className="hover:text-cyan-300 transition-colors block"
                  >
                    +254 704 746 482
                  </a>
                </div>
              </motion.li>
              <motion.li
                className="flex items-center gap-3 group"
                whileHover={{ x: 5 }}
              >
                <FiMail className="text-cyan-400" />
                <a
                  href="mailto:adit.investmentlimited@gmail.comitinvestment.com"
                  className="hover:text-cyan-300 transition-colors"
                >
                  adit.investmentlimited@gmail.comitinvestment.com
                </a>
              </motion.li>
              <motion.li
                className="flex items-center gap-3 group"
                whileHover={{ x: 5 }}
              >
                <FiClock className="text-cyan-400" />
                <span className="group-hover:text-cyan-300 transition-colors">
                  Mon-Sat: 8AM - 7PM
                </span>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-gray-800/50 mt-12 pt-8 text-center text-gray-500 text-sm">
          <div className="mb-4">
            © {new Date().getFullYear()} Adit Investment Ltd. All Rights
            Reserved.
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-sm">
            <span>Website Created By</span>

            <motion.a
              href="https://glimmerink.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-white transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
            >
              GlimmerInk Creations
            </motion.a>

            <span className="hidden md:inline">|</span>

            <motion.a
              href="tel:+254746527253"
              className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <FiPhone size={12} />
              <span className="font-medium">+254 746 527 253</span>
            </motion.a>

            <span className="hidden md:inline">|</span>

            <motion.a
              href="mailto:nyamuehud@gmail.com"
              className="text-cyan-400 hover:text-white transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
            >
              nyamuehud@gmail.com
            </motion.a>
          </div>
        </div>
      </motion.div>
      {/* Floating CTA */}
      <motion.div
        className="fixed right-6 bottom-6 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.a
          href="https://wa.me/254733681921"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaWhatsapp size={20} />
          <span>Chat with Us</span>
        </motion.a>
      </motion.div>
    </footer>
  );
}
