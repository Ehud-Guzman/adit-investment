// AboutStory.jsx
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function AboutStory() {
  return (
    <section
      id="story"
      className="relative py-16 sm:py-20 md:py-24 bg-white text-gray-900 border-y border-gray-100"
    >
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center relative z-10">
        {" "}
        {/* Removed px classes */}
        {/* Text Block */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 sm:w-10 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mr-3 rounded-full" />
            <span className="text-cyan-600 font-semibold uppercase tracking-wide text-sm">
              Our Journey
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug mb-5">
            From Small Start to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
              Regional Tech Influence
            </span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg mb-4">
            Founded in Busia, Kenya, ADIT began with a simple goal — empower
            local businesses through digital tools. With every project, we grew
            stronger and bolder.
          </p>

          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Today, we deliver advanced tech to clients across sectors — secure
            networks, smart hardware, and powerful custom software. Innovation
            isn't just what we do. It's who we are.
          </p>

          <a
            href="#team"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-700 transition-colors duration-300 font-medium text-sm"
          >
            Meet the Team <FiArrowRight className="mt-[1px]" />
          </a>
        </motion.div>
        {/* Image Block */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative w-full max-w-md mx-auto sm:max-w-none aspect-[16/10] sm:aspect-video min-h-[180px] sm:min-h-[320px] rounded-xl md:rounded-2xl overflow-hidden shadow-xl group border-0 sm:border border-gray-200">
            <img
              src="/assets/images/services/adit cover photo.jpg"
              alt="ADIT Busia HQ"
              className="object-contain w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-5 z-20">
              <h3 className="text-white text-base sm:text-lg font-semibold">
                Our Busia HQ
              </h3>
              <p className="text-gray-200 text-xs sm:text-sm">
                Where strategy meets execution
              </p>
            </div>
          </div>

         {/* Floating Avatar */}
{/* 
<div className="flex justify-center md:justify-start">
  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-left-6 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-4 border-white shadow-lg z-30">
    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
  </div>
</div> 
*/}
        </motion.div>
      </div>
    </section>
  );
}
