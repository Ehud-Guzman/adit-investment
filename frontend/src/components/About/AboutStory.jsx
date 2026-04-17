// AboutStory.jsx
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function AboutStory() {
  return (
    <section
      id="story"
      className="py-20 sm:py-24 bg-muted"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">
            Our Journey
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark leading-snug mb-6">
            From Small Start to{" "}
            <span className="text-primary">Regional Tech Influence</span>
          </h2>

          <p className="text-textLight text-base sm:text-lg mb-4 leading-relaxed">
            Founded in Busia, Kenya, ADIT began with a simple goal — empower
            local businesses through digital tools. With every project, we grew
            stronger and bolder.
          </p>

          <p className="text-textLight text-base sm:text-lg mb-8 leading-relaxed">
            Today, we deliver advanced technology to clients across sectors —
            secure networks, smart hardware, and powerful custom software.
            Innovation isn't just what we do. It's who we are.
          </p>

          <a
            href="#team"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200"
          >
            Meet the Team <FiArrowRight />
          </a>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10]">
            <img
              src="/assets/images/services/adit cover photo.jpg"
              alt="ADIT Busia HQ"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 sm:p-6">
              <p className="text-white font-bold text-lg">Our Busia HQ</p>
              <p className="text-white/70 text-sm">Where strategy meets execution</p>
            </div>
          </div>

          {/* Accent badge */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3">
            <span className="text-white font-extrabold text-lg leading-none text-center">
              Est.<br />2018
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
