import { motion } from "framer-motion";
import { FiAward, FiUsers, FiGlobe, FiTrendingUp } from "react-icons/fi";

const stats = [
  { id: 1, value: "100+", label: "Clients Served", icon: <FiUsers className="w-8 h-8" /> },
  { id: 2, value: "9+", label: "Years in Business", icon: <FiTrendingUp className="w-8 h-8" /> },
  { id: 3, value: "150+", label: "Projects Completed", icon: <FiAward className="w-8 h-8" /> },
  { id: 4, value: "East Africa", label: "Regional Presence", icon: <FiGlobe className="w-8 h-8" /> },
];

const team = [
  { id: 1, name: "Placeholder", role: "CEO & Founder", bio: "Visionary leader with 10+ years in ICT infrastructure.", img: "/team-ceo.jpg" },
  { id: 2, name: "Placeholder", role: "CTO", bio: "Expert in network security and enterprise solutions.", img: "/team-cto.jpg" },
  { id: 3, name: "Placeholder", role: "Software Technician", bio: "Software specialist with deep diagnosis expertise.", img: "/team-tech.jpg" },
  { id: 4, name: "Placeholder", role: "Sales Director", bio: "Drives client success with tailored IT solutions.", img: "/team-sales.jpg" },
];

export default function About() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      {/* === HERO SECTION === */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400/10 via-blue-500/5 to-transparent animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600"
          >
            Pioneering ICT Excellence in East Africa
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
          >
            Empowering businesses with cutting-edge technology since 2018.
          </motion.p>
        </div>
      </section>

      {/* === OUR STORY === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in Busia, Kenya, ADIT Investment Ltd started as a small IT solutions provider with a big vision: to bridge the digital divide in East Africa.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Today, we’re a trusted partner for businesses across multiple sectors, delivering reliable hardware, secure networks, and innovative software solutions.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <span className="font-medium text-gray-700">Driven by innovation, powered by people</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/office-team.jpg" 
                  alt="ADIT Investment Team" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                <img src="/founder.jpg" alt="Founder" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === MISSION & VISION === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Core Beliefs</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Guiding principles that drive everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-green-500"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Mission</h3>
              <p className="text-gray-600 mb-6">
                To deliver innovative, reliable, and affordable ICT solutions that empower businesses to thrive in the digital economy.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-1 bg-green-500"></div>
                <span className="text-sm font-medium text-gray-500">Delivering excellence daily</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-500"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Vision</h3>
              <p className="text-gray-600 mb-6">
                To be East Africa's most trusted technology partner, transforming businesses through cutting-edge digital solutions.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-1 bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-500">Building the future</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === IMPACT STATS === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
              >
                <div className="flex justify-center mb-4 text-white">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                <p className="text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === OUR TEAM === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Meet The Brains Behind ADIT</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A team of passionate innovators driving your digital success
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {member.bio}
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === VALUES === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The foundation of how we operate and serve our clients
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly explore new technologies to deliver future-proof solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-gray-600">
                Honest advice and transparent pricing—no hidden costs or surprises.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                From consultation to implementation, we deliver premium quality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-700 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Power Your Business with Cutting-Edge IT?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl mb-8"
          >
            Let's discuss how we can transform your technology infrastructure.
          </motion.p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-white text-green-700 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Today
          </motion.a>
        </div>
      </section>
    </div>
  );
}