// AboutTeam.jsx
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

const team = [
  {
    id: 1,
    name: "Placeholder",
    role: "CEO & Founder",
    bio: "Visionary leader with 10+ years in ICT infrastructure.",
    img: "/team-ceo.jpg",
  },
  {
    id: 2,
    name: "Placeholder",
    role: "CTO",
    bio: "Expert in network security and enterprise solutions.",
    img: "/team-cto.jpg",
  },
  {
    id: 3,
    name: "Placeholder",
    role: "Software Technician",
    bio: "Software specialist with deep diagnosis expertise.",
    img: "/team-tech.jpg",
  },
  {
    id: 4,
    name: "Placeholder",
    role: "Sales Director",
    bio: "Drives client success with tailored IT solutions.",
    img: "/team-sales.jpg",
  },
];

export default function AboutTeam() {
  return (
    <section
      id="team"
      className="relative py-16 sm:py-20 md:py-24 bg-white text-gray-900 border-t border-gray-100"
    >
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center mb-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100">
            <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-ping" />
            <span className="text-xs sm:text-sm font-medium text-cyan-700 tracking-wider uppercase">
              Team Spotlight
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-sm">
            Meet the Faces Powering <span className="text-gray-900">ADIT</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate innovators turning tech challenges into solutions across East Africa.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {team.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200"
            >
              {/* Avatar Block */}
              <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden">
                <div className="bg-gray-200 border-2 border-dashed w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-3 sm:p-4 flex flex-col justify-end">
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{member.bio}</p>
                  <div className="flex gap-2 mt-3">
                    {[FaLinkedin, FaTwitter].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-8 h-8 rounded-full bg-cyan-50 hover:bg-cyan-100 flex items-center justify-center transition-all border border-cyan-200"
                      >
                        <Icon className="text-cyan-600 w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="p-4 text-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-cyan-600 font-medium text-xs sm:text-sm">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}