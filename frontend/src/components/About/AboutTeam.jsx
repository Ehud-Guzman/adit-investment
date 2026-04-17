// AboutTeam.jsx
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

const team = [
  {
    id: 1,
    name: "Placeholder",
    role: "CEO & Founder",
    bio: "Visionary leader with 10+ years in ICT infrastructure.",
  },
  {
    id: 2,
    name: "Placeholder",
    role: "CTO",
    bio: "Expert in network security and enterprise solutions.",
  },
  {
    id: 3,
    name: "Placeholder",
    role: "Software Technician",
    bio: "Software specialist with deep diagnosis expertise.",
  },
  {
    id: 4,
    name: "Placeholder",
    role: "Sales Director",
    bio: "Drives client success with tailored IT solutions.",
  },
];

export default function AboutTeam() {
  return (
    <section id="team" className="py-20 sm:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block mb-4 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">
            Team Spotlight
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-3">
            The People Powering <span className="text-primary">ADIT</span>
          </h2>
          <p className="text-textLight max-w-xl mx-auto">
            Passionate innovators turning tech challenges into solutions across East Africa.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              {/* Avatar */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed border-gray-300" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4">
                  <p className="text-white text-sm leading-relaxed mb-3">{member.bio}</p>
                  <div className="flex gap-2">
                    {[FaLinkedin, FaTwitter].map((Icon, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-primary flex items-center justify-center transition-colors border border-white/30"
                      >
                        <Icon className="text-white w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & role */}
              <div className="p-4 text-center">
                <h3 className="font-bold text-dark text-base">{member.name}</h3>
                <p className="text-primary text-sm font-medium mt-0.5">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
