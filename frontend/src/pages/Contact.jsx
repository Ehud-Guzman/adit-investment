import ContactHero from "@/components/Contact/ContactHero";
import ContactInfoCards from "@/components/Contact/ContactInfoCards";
import BusinessHoursCard from "@/components/Contact/BusinessHoursCard";
import ContactForm from "@/components/Contact/ContactForm";
import { showContactToast } from "@/components/Contact/ContactToast";
import FAQAccordion from "@/components/Contact/FAQAccordion";
import MapSection from "@/components/Contact/MapSection";
import ContactCTA from "@/components/Contact/ContactCTA";
import { motion } from "framer-motion";

const Contact = () => {
  const handleSubmit = async (formData) => {
    try {
      // your API call here
      showContactToast("success");
    } catch (err) {
      showContactToast("error");
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <ContactHero />
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ContactInfoCards />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <BusinessHoursCard />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <ContactForm onSubmit={handleSubmit} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <FAQAccordion />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <MapSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <ContactCTA />
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;