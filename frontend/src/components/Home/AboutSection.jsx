import { motion } from "framer-motion";
import MarqueeAd from "@/components/ads/MarqueeAd";



const features = [
  "10+ years industry experience",
  "Certified technicians",
  "Genuine products guarantee",
  "24/7 customer support",
];

const AboutSection = () => {
  return (
    <>
      <MarqueeAd />

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-dark relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Text Block */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center md:text-left leading-tight">
              About{" "}
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-accent bg-clip-text text-transparent drop-shadow-sm">
                ADIT Investment
              </span>
            </h2>

            <p className="text-lg text-text mb-4">
              ADIT Investment Limited is your trusted partner for innovative ICT
              solutions in Kenya and East Africa. We combine technical expertise
              with a deep understanding of local business needs.
            </p>
            <p className="text-lg text-text mb-6">
              Based in Busia with a branch in Bondo Town and operating region-wide,
              we're committed to delivering affordable, high-quality services that
              drive your digital transformation.
            </p>

            <ul className="space-y-4">
              {features.map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-base text-text">{item}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Image Block */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-white group hover:shadow-[0_20px_60px_-10px_rgba(0,166,81,0.4)] transition-all duration-500">
            
              <img
                src="/assets/images/services/adit cover photo.jpg"
                alt="ADIT Investment Office"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
