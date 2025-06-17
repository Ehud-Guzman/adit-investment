import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiArrowRight, FiCheck, FiShield, FiServer, FiWifi, FiCpu, FiHardDrive, FiCode, FiTool } from "react-icons/fi";

const services = [
  {
    id: 1,
    title: "IT Equipment Sales",
    description: "Premium laptops, printers, and networking gear from top brands",
    icon: <FiCpu className="w-8 h-8" />,
    category: "hardware",
    features: [
      "Enterprise-grade hardware",
      "Warranty included",
      "Bulk purchase discounts",
      "After-sales support"
    ],
    image: "/assets/images/services/laptop sales.jpg"
  },
  {
    id: 2,
    title: "Network Installation",
    description: "Complete office network solutions for seamless connectivity",
    icon: <FiWifi className="w-8 h-8" />,
    category: "installation",
    features: [
      "Structured cabling",
      "WiFi 6 deployment",
      "VPN setup",
      "Network optimization"
    ],
    image: "/assets/images/services/network installation.jpg"
  },
  {
    id: 3,
    title: "Computer Repairs",
    description: "Expert diagnostics and repair for all computer issues",
    icon: <FiTool className="w-8 h-8" />,
    category: "repairs",
    features: [
      "Hardware repairs",
      "Data recovery",
      "Virus removal",
      "Component upgrades"
    ],
    image: "/assets/images/services/computer repair.jpg"
  },
  {
    id: 4,
    title: "Security Systems",
    description: "Comprehensive security solutions for your premises",
    icon: <FiShield className="w-8 h-8" />,
    category: "security",
    features: [
      "CCTV installation",
      "Access control",
      "Alarm systems",
      "24/7 monitoring"
    ],
    image: "/assets/images/services/ict security.jpg"
  },
  {
    id: 5,
    title: "Server Solutions",
    description: "Reliable server infrastructure for your business",
    icon: <FiServer className="w-8 h-8" />,
    category: "infrastructure",
    features: [
      "On-premise servers",
      "Cloud migration",
      "Data backup",
      "Disaster recovery"
    ],
    image: "/assets/images/services/server rack.jpg"
  },
  {
    id: 6,
    title: "Software Development",
    description: "Custom software tailored to your business needs",
    icon: <FiCode className="w-8 h-8" />,
    category: "software",
    features: [
      "Web applications",
      "Mobile apps",
      "ERP systems",
      "UI/UX design"
    ],
    image: "/assets/images/services/coding.jpg"
  }
];

const testimonials = [
  {
    id: 1,
    name: "James Mwangi",
    position: "CEO, Nairobi Enterprises",
    content: "ADIT transformed our entire network infrastructure. Their team was professional and delivered ahead of schedule.",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Kiptoo",
    position: "IT Manager, Coastal Hotels",
    content: "The security systems they installed have given us peace of mind. Excellent after-sales support too.",
    rating: 5
  },
  {
    id: 3,
    name: "David Omondi",
    position: "Operations Director, Mombasa Logistics",
    content: "Their computer repair team saved us from losing critical data. Highly recommended for any business.",
    rating: 4
  }
];

const partners = [
  { id: 1, name: "Dell", logo: "/assets/images/services/dell-logo.webp" },
  { id: 2, name: "HP", logo: "/assets/images/services/hp logo.png" },
  { id: 3, name: "Cisco", logo: "/assets/images/services/cisco-logo.png" },
  { id: 4, name: "Microsoft", logo: "/assets/images/services/microsoft_logo.png" },
  { id: 5, name: "Hikvision", logo: "/assets/images/services/Hikvision-Logo.png" },
  { id: 6, name: "Dahua", logo: "/assets/images/services/dahua logo.jpg" },
  { id: 7, name: "Kyocera", logo: "/assets/images/services/kyocera.svg" },
  { id: 7, name: "Epson", logo: "/assets/images/services/epson-logo.png" },
];

export default function ServicesPage() {
  const colors = {
    primary: "#007A3D",
    secondary: "#0056B3",
    gradient: "linear-gradient(135deg, #007A3D 0%, #0056B3 100%)",
  };

  const [activeServiceTab, setActiveServiceTab] = useState("all");
  const [expandedService, setExpandedService] = useState(null);

  const filteredServices = activeServiceTab === "all" 
    ? services 
    : services.filter(service => service.category === activeServiceTab);

  const toggleServiceExpand = (id) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* === HERO SECTION === */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400/20 via-blue-500/10 to-transparent animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent"
              style={{ backgroundImage: colors.gradient }}
            >
              Comprehensive ICT Solutions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            >
              Cutting-edge technology services designed to propel your business forward in the digital age.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* === SERVICE SHOWCASE === */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our ICT Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer end-to-end technology solutions tailored for businesses of all sizes
            </p>
          </motion.div>

          {/* Service Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["all", "hardware", "installation", "repairs", "security", "infrastructure", "software"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveServiceTab(tab)}
                className={`px-6 py-2 rounded-full font-medium capitalize ${
                  activeServiceTab === tab
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100 ${
                  expandedService === service.id ? "ring-2 ring-green-500" : ""
                }`}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-white text-green-600">
                        {service.icon}
                      </div>
                      <h3 className="ml-3 text-xl font-bold text-white">{service.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  {expandedService === service.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                  
                  <button 
                    onClick={() => toggleServiceExpand(service.id)}
                    className="flex items-center text-green-600 font-medium group"
                  >
                    {expandedService === service.id ? "Show less" : "Learn more"} 
                    <FiArrowRight className={`ml-2 transition-transform ${expandedService === service.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === SERVICE PROCESS === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Service Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A streamlined approach to delivering exceptional ICT solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Consultation</h3>
              <p className="text-gray-600 text-center">
                We listen to understand your specific business needs and challenges
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Solution Design</h3>
              <p className="text-gray-600 text-center">
                Our experts create a customized technology plan for your business
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Implementation</h3>
              <p className="text-gray-600 text-center">
                Seamless deployment with minimal disruption to your operations
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mb-4 mx-auto">
                4
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Support</h3>
              <p className="text-gray-600 text-center">
                Ongoing maintenance and support to ensure optimal performance
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === INDUSTRY SOLUTIONS === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Industry-Specific Solutions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tailored technology packages for different business sectors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Healthcare */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">HIPAA-compliant systems</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Medical record management</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Telemedicine solutions</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Hospital network infrastructure</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-green-600 mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Computer lab setups</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">E-learning platforms</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Campus-wide networking</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Student information systems</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Retail */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Retail & Hospitality</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">POS systems</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Inventory management</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Customer WiFi solutions</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Digital signage</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Trusted by businesses across Kenya and East Africa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === TECHNOLOGY PARTNERS === */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Technology Partners</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We work with leading brands to deliver premium solutions
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                whileHover={{ scale: 1.1 }}
                className="h-16 flex items-center"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Let's discuss how our ICT solutions can drive your business forward.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}