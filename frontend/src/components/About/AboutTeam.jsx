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
      className="relative py-20 sm:py-24 px-4 md:px-8 lg:px-16 xl:px-20 bg-white text-gray-900 border-t border-gray-100"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100">
            <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-ping" />
            <span className="text-sm font-medium text-cyan-700 tracking-wider uppercase">
              Team Spotlight
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-sm">
            Meet the Faces Powering <span className="text-gray-900">ADIT</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate innovators turning tech challenges into solutions across East Africa.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {team.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200"
            >
              {/* Avatar Block */}
              <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4 sm:p-5 flex flex-col justify-end">
                  <p className="text-sm text-gray-800 leading-relaxed">{member.bio}</p>
                  <div className="flex gap-3 mt-4">
                    {[FaLinkedin, FaTwitter].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-9 h-9 rounded-full bg-cyan-50 hover:bg-cyan-100 flex items-center justify-center transition-all border border-cyan-200"
                      >
                        <Icon className="text-cyan-600 w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="p-4 text-center sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-cyan-600 font-medium text-sm">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
