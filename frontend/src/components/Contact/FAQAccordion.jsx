import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

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
    question: "Do you offer customer support on Sundays?",
    answer: "Not officially, but we monitor emails for urgent issues.",
  },
  {
    question: "What areas do you serve?",
    answer: "We primarily serve businesses across East Africa, with offices in Kenya",
  },
  {
    question: "Do you offer remote consultations?",
    answer: "Yes, we offer video consultations for all our services.",
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
    setActiveIndex(null);
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-16 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 mb-6">
          Common questions about contacting us and our services
        </p>
        <button
          onClick={toggleAll}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
        >
          {showAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = showAll || activeIndex === i;

          return (
            <motion.div
              key={i}
              layout
              className={`rounded-lg overflow-hidden border ${isOpen ? "border-cyan-300" : "border-gray-200"}`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white focus:outline-none"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <FiChevronDown
                  className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180 text-cyan-500" : "text-gray-500"}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-4 text-gray-600"
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