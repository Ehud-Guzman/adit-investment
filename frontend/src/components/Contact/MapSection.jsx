import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <motion.section
      id="location"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-200"
    >
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Our Locations</h2>
        <p className="text-gray-600 mb-4">
          Find us at our offices in Busia and Bondo Town, Kenya
        </p>
      </div>
      <iframe
        title="Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127877.64452421492!2d34.0923996!3d0.4572096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177f17dfb15f9313%3A0xd8f258fbd3a3e373!2sBusia!5e0!3m2!1sen!2ske!4v1689937890000!5m2!1sen!2ske"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        className="w-full h-[400px]"
      />
    </motion.section>
  );
}