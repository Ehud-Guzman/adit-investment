import { motion } from "framer-motion";
import { FiAward, FiUsers, FiGlobe, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp,  } from "react-icons/fa";
import { FiPhone } from 'react-icons/fi'; // ✅ CORRECT


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
  // Techy gradient colors
  const colors = {
    primary: '#00f2c3',
    secondary: '#0098f0',
    accent: '#6e45e2',
    dark: '#0f172a',
    light: '#f8fafc'
  };

  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              transition: {
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
          />
        ))}
      </div>

      {/* === HERO SECTION === */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-blue-500/10 to-purple-500/20 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400"
          >
            Pioneering <span className="text-white">ICT Excellence</span> in East Africa
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Empowering businesses with cutting-edge technology since 2018.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="#story"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Explore Our Story <FiArrowRight />
            </motion.a>
            <motion.a
              href="#team"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-medium border-2 border-gray-600 hover:border-cyan-400 text-white hover:text-cyan-400 transition-all"
            >
              Meet The Team
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* === OUR STORY === */}
      <section id="story" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 mr-4"></div>
                <span className="text-cyan-400 font-medium">OUR JOURNEY</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">From Humble Beginnings to Tech Leaders</h2>
              <p className="text-lg text-gray-300 mb-6">
                Founded in Busia, Kenya, ADIT Investment Ltd started as a small IT solutions provider with a big vision: to bridge the digital divide in East Africa.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Today, we're a trusted partner for businesses across multiple sectors, delivering reliable hardware, secure networks, and innovative software solutions.
              </p>
              
              <motion.div
                whileHover={{ x: 5 }}
                className="inline-flex items-center text-cyan-400 group cursor-pointer"
              >
                <span className="mr-2">Read full company history</span>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="relative"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 group">
                <img 
                  src="/office-team.jpg" 
                  alt="ADIT Investment Team" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-bold">Our Busia Headquarters</h3>
                  <p className="text-gray-300">Where innovation meets execution</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl overflow-hidden border-4 border-gray-800 shadow-lg z-10">
                <img src="/founder.jpg" alt="Founder" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === MISSION & VISION === */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Core Beliefs</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Guiding principles that drive everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="bg-gray-800/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-cyan-400 group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-xl"></div>
              <h3 className="text-2xl font-bold mb-4 text-white">Mission</h3>
              <p className="text-gray-300 mb-6">
                To deliver innovative, reliable, and affordable ICT solutions that empower businesses to thrive in the digital economy.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-1 bg-cyan-400"></div>
                <span className="text-sm font-medium text-gray-400">Delivering excellence daily</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="bg-gray-800/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-400 group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-blue-500/10 blur-xl"></div>
              <h3 className="text-2xl font-bold mb-4 text-white">Vision</h3>
              <p className="text-gray-300 mb-6">
                To be East Africa's most trusted technology partner, transforming businesses through cutting-edge digital solutions.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-1 bg-blue-400"></div>
                <span className="text-sm font-medium text-gray-400">Building the future</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === IMPACT STATS === */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="grid md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:border-white/40 transition-all group"
              >
                <div className="flex justify-center mb-6 text-white">
                  <div className="p-4 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-2 text-center">{stat.value}</h3>
                <p className="text-lg text-center text-white/90">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === OUR TEAM === */}
      <section id="team" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-gray-800 border border-gray-700">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              <span className="text-cyan-400 text-sm font-medium">MEET THE TEAM</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">The Minds Powering ADIT</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
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
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-sm">
                      {member.bio}
                    </p>
                    <div className="flex space-x-3 mt-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      {[FaLinkedin, FaTwitter].map((Icon, i) => (
                        <a 
                          key={i} 
                          href="#" 
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-cyan-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === VALUES === */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gray-800/50 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Operating Values</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              The foundation of how we operate and serve our clients
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "We constantly explore new technologies to deliver future-proof solutions.",
                color: "cyan"
              },
              {
                title: "Integrity",
                description: "Honest advice and transparent pricing—no hidden costs or surprises.",
                color: "blue"
              },
              {
                title: "Excellence",
                description: "From consultation to implementation, we deliver premium quality.",
                color: "purple"
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className={`bg-gray-800/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-t-4 border-${value.color}-400 group relative overflow-hidden`}
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-${value.color}-500/10 blur-xl`}></div>
                <div className={`w-16 h-16 rounded-full bg-${value.color}-500/10 flex items-center justify-center text-2xl font-bold mb-6 text-${value.color}-400`}>
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-700 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Power Your Business with Cutting-Edge IT?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Let's discuss how we can transform your technology infrastructure.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="/contact"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-cyan-700 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Get Started Today <FiArrowRight />
            </motion.a>
            <motion.a
              href="tel:+254733681921"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <FiPhone /> Call Now
            </motion.a>
          </div>
          
          <div className="flex justify-center mt-12 space-x-4">
            {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}