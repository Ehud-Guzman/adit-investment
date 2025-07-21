import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    question: "How long does it take to get a response?",
    answer: "We typically respond within 24 hours during business days.",
  },
  {
    question: "Can I call you directly?",
    answer: "Yes, feel free to call us anytime between 8am - 5pm (Mon-Sat).",
  },
  {
    question: "Do you offer customer support on weekends?",
    answer: "Not officially, but we monitor emails for urgent issues.",
  },
];

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const toggleAll = () => {
    setShowAll((prev) => !prev);
    setActiveIndex(null); // reset individual toggles
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
          Frequently Asked Questions
        </h2>
        <button
          onClick={toggleAll}
          className="mt-4 text-sm px-4 py-2 rounded-md bg-gray-800/50 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/10 transition-all"
        >
          {showAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="space-y-5">
        {faqs.map((faq, i) => {
          const isOpen = showAll || activeIndex === i;

          return (
            <motion.div
              key={i}
              layout
              transition={{ layout: { duration: 0.3, type: "spring" } }}
              className={`rounded-xl overflow-hidden border-2 backdrop-blur-lg ${
                isOpen
                  ? "border-cyan-500 bg-gray-900/60 shadow-xl"
                  : "border-gray-700 bg-gray-800/40 hover:border-cyan-400/30"
              } transition-all`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <span className="text-lg">{faq.question}</span>
                <FiChevronDown
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-cyan-400" : "rotate-0 text-white"
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 text-gray-300 leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
