import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiArrowRight, FiCheck, FiShield, FiServer, FiWifi,
  FiCpu, FiCode, FiTool, FiChevronDown,
} from "react-icons/fi";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["all", "hardware", "installation", "repairs", "security", "infrastructure", "software"];

const services = [
  {
    id: 1,
    title: "IT Equipment Sales",
    description: "Premium laptops, printers, and networking gear from top brands",
    icon: <FiCpu className="w-6 h-6" />,
    category: "hardware",
    features: ["Enterprise-grade hardware", "Warranty included", "Bulk purchase discounts", "After-sales support"],
    image: "/assets/images/services/laptop sales.jpg",
  },
  {
    id: 2,
    title: "Network Installation",
    description: "Complete office network solutions for seamless connectivity",
    icon: <FiWifi className="w-6 h-6" />,
    category: "installation",
    features: ["Structured cabling", "WiFi 6 deployment", "VPN setup", "Network optimization"],
    image: "/assets/images/services/network installation.jpg",
  },
  {
    id: 3,
    title: "Computer Repairs",
    description: "Expert diagnostics and repair for all computer issues",
    icon: <FiTool className="w-6 h-6" />,
    category: "repairs",
    features: ["Hardware repairs", "Data recovery", "Virus removal", "Component upgrades"],
    image: "/assets/images/services/computer repair.jpg",
  },
  {
    id: 4,
    title: "Security Systems",
    description: "Comprehensive security solutions for your premises",
    icon: <FiShield className="w-6 h-6" />,
    category: "security",
    features: ["CCTV installation", "Access control", "Alarm systems", "24/7 monitoring"],
    image: "/assets/images/services/ict security.jpg",
  },
  {
    id: 5,
    title: "Server Solutions",
    description: "Reliable server infrastructure for your business",
    icon: <FiServer className="w-6 h-6" />,
    category: "infrastructure",
    features: ["On-premise servers", "Cloud migration", "Data backup", "Disaster recovery"],
    image: "/assets/images/services/server rack.jpg",
  },
  {
    id: 6,
    title: "Software Development",
    description: "Custom software tailored to your business needs",
    icon: <FiCode className="w-6 h-6" />,
    category: "software",
    features: ["Web applications", "Mobile apps", "ERP systems", "UI/UX design"],
    image: "/assets/images/services/coding.jpg",
  },
];

const process = [
  { step: 1, title: "Consultation", desc: "We understand your business needs and challenges in depth." },
  { step: 2, title: "Solution Design", desc: "A customised technology plan is crafted for your goals." },
  { step: 3, title: "Implementation", desc: "Seamless deployment with minimal disruption to operations." },
  { step: 4, title: "Support", desc: "Ongoing maintenance ensuring optimal performance always." },
];

const industries = [
  {
    title: "Healthcare",
    color: "primary",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    items: ["Security surveillance systems", "Medical record management", "Telemedicine solutions", "Hospital network infrastructure"],
  },
  {
    title: "Education",
    color: "accent",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    items: ["Computer lab setups", "E-learning platforms", "Campus-wide networking", "Student information systems"],
  },
  {
    title: "Retail & Hospitality",
    color: "primary",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    items: ["POS systems", "Inventory management", "Customer WiFi solutions", "Digital signage"],
  },
];

const testimonials = [
  {
    id: 1,
    name: "Edwin",
    position: "Manager, Itoya Hotel",
    content: "ADIT transformed our entire network infrastructure. Their team was professional and delivered ahead of schedule.",
    rating: 5,
  },
  {
    id: 2,
    name: "John",
    position: "Operations Manager, Stirling Medical Center",
    content: "The security systems they installed have given us peace of mind. Excellent after-sales support too.",
    rating: 5,
  },
  {
    id: 3,
    name: "Paul",
    position: "General Manager, Ayoti Distributors Ltd",
    content: "Software installation and system maintenance handled efficiently. Highly professional team.",
    rating: 4,
  },
];

const partners = [
  { id: 1, name: "Dell", logo: "/assets/images/services/dell-logo.webp" },
  { id: 2, name: "HP", logo: "/assets/images/services/hp logo.png" },
  { id: 3, name: "Cisco", logo: "/assets/images/services/cisco-logo.png" },
  { id: 4, name: "Microsoft", logo: "/assets/images/services/microsoft_logo.png" },
  { id: 5, name: "Hikvision", logo: "/assets/images/services/Hikvision-Logo.png" },
  { id: 6, name: "Dahua", logo: "/assets/images/services/dahua logo.jpg" },
  { id: 7, name: "Kyocera", logo: "/assets/images/services/kyocera.svg" },
  { id: 8, name: "Epson", logo: "/assets/images/services/epson-logo.png" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ServiceCard({ service, isExpanded, onToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border overflow-hidden flex flex-col ${
        isExpanded ? "border-primary" : "border-gray-100"
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
          <span className="p-2 bg-primary rounded-lg text-white shadow">{service.icon}</span>
          <h3 className="text-lg font-bold text-white drop-shadow">{service.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-textLight text-sm mb-4 flex-1">{service.description}</p>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="features"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Key Features</p>
              <ul className="space-y-1.5">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text">
                    <FiCheck className="text-primary mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-auto group"
        >
          {isExpanded ? "Show less" : "Learn more"}
          <FiChevronDown
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : "group-hover:translate-y-0.5"}`}
          />
        </button>
      </div>
    </motion.div>
  );
}

function StepCard({ step, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="relative flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-5 shadow-lg shadow-primary/30 z-10">
        {step}
      </div>
      <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
      <p className="text-textLight text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = activeTab === "all" ? services : services.filter((s) => s.category === activeTab);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="min-h-screen bg-muted font-inter">

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full tracking-wide"
          >
            What We Offer
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-dark mb-6 leading-tight"
          >
            Comprehensive{" "}
            <span className="text-primary">ICT Solutions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-textLight max-w-2xl mx-auto mb-10"
          >
            Cutting-edge technology services designed to propel your business
            forward — from hardware to software and everything in between.
          </motion.p>

          <motion.a
            href="/contact"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
          >
            Get a Free Quote <FiArrowRight />
          </motion.a>
        </div>
      </section>

      {/* ── SERVICES GRID ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark mb-3">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-textLight max-w-xl mx-auto">
              End-to-end technology solutions for businesses of all sizes
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORIES.map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setActiveTab(tab); setExpandedId(null); }}
                className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-primary text-white shadow shadow-primary/30"
                    : "bg-white text-textLight border border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Cards */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            <AnimatePresence mode="popLayout">
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isExpanded={expandedId === service.id}
                  onToggle={() => toggleExpand(service.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── OUR PROCESS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark mb-3">
              How We <span className="text-primary">Work</span>
            </h2>
            <p className="text-textLight max-w-xl mx-auto">
              A streamlined, four-step approach to delivering exceptional results
            </p>
          </motion.div>

          <div className="relative grid md:grid-cols-4 gap-10">
            {/* connecting line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 z-0" />

            {process.map((p, i) => (
              <StepCard key={p.step} {...p} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY SOLUTIONS ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark mb-3">
              Industry <span className="text-primary">Solutions</span>
            </h2>
            <p className="text-textLight max-w-xl mx-auto">
              Tailored technology packages built for different sectors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow ${
                  ind.color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                }`}>
                  {ind.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-5">{ind.title}</h3>
                <ul className="space-y-3">
                  {ind.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text">
                      <FiCheck className={`mt-0.5 flex-shrink-0 ${ind.color === "primary" ? "text-primary" : "text-accent"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark mb-3">
              Client <span className="text-primary">Testimonials</span>
            </h2>
            <p className="text-textLight max-w-xl mx-auto">
              Trusted by businesses across Kenya and East Africa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-muted rounded-2xl p-8 border border-gray-100 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className={`w-5 h-5 ${idx < t.rating ? "text-secondary" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-text italic text-sm leading-relaxed flex-1 mb-6">"{t.content}"</p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{t.name}</p>
                    <p className="text-textLight text-xs">{t.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY PARTNERS ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-sm font-semibold uppercase tracking-widest text-textLight mb-10"
          >
            Trusted Technology Partners
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {partners.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08 }}
                className="h-12 flex items-center"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
              Ready to Transform Your Business?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Discover how our ICT solutions can drive growth, efficiency, and security for your organisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Get in Touch <FiArrowRight />
              </motion.a>
              <motion.a
                href="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/60 hover:border-white transition-all"
              >
                Browse Products
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
