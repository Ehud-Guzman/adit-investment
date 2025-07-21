// components/contact/ContactInfoCards.jsx
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const cards = [
  {
    icon: <FiMail className="w-6 h-6 text-cyan-700" />,
    title: "Email Us",
    content: "adit.investmentlimited@gmail.com",
    action: "Send a message",
    link: "mailto:adit.investmentlimited@gmail.com",
    bg: "bg-gradient-to-br from-cyan-100 to-white",
    border: "border-cyan-200",
    textColor: "text-cyan-700",
  },
  {
    icon: <FiPhone className="w-6 h-6 text-blue-700" />,
    title: "Call Us",
    content: ["+254 733 681 921", "+254 704 970 535"],
    action: "Call now",
    link: "tel:+254733681921",
    bg: "bg-gradient-to-br from-blue-100 to-white",
    border: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    icon: <FiMapPin className="w-6 h-6 text-purple-700" />,
    title: "Visit Us",
    content: "Busia and Bondo Town, Kenya",
    
    action: "View on map",
    link: "#location",
    isScroll: true,
    bg: "bg-gradient-to-br from-purple-100 to-white",
    border: "border-purple-200",
    textColor: "text-purple-700",
  },
];

export default function ContactInfoCards() {
  return (
    <div className="space-y-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          viewport={{ once: true }}
          className={`p-6 rounded-xl shadow-md transition-all border ${card.bg} ${card.border}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 p-3 rounded-lg bg-white shadow-sm">
              {card.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>

              {Array.isArray(card.content) ? (
                card.content.map((line, idx) => (
                  <p key={idx} className="text-gray-600 mt-1">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-gray-600 mt-1">{card.content}</p>
              )}

              {card.isScroll ? (
                <button
                  className={`inline-block mt-3 text-sm font-medium hover:underline ${card.textColor}`}
                  onClick={() =>
                    document.getElementById("location")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  {card.action}
                </button>
              ) : (
                <a
                  href={card.link}
                  className={`inline-block mt-3 text-sm font-medium hover:underline ${card.textColor}`}
                >
                  {card.action}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
