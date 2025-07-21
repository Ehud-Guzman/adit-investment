import ContactHero from "@/components/Contact/ContactHero";
import ContactInfoCards from "@/components/Contact/ContactInfoCards";
import BusinessHoursCard from "@/components/Contact/BusinessHoursCard";
import ContactForm from "@/components/Contact/ContactForm";
import { showContactToast } from "@/components/Contact/ContactToast";
import FAQAccordion from "@/components/Contact/FAQAccordion";
import MapSection from "@/components/Contact/MapSection";
import ContactCTA from "@/components/Contact/ContactCTA";

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
    <main className="space-y-20 px-6 max-w-7xl mx-auto py-16">
      <ContactHero />
      <div className="grid md:grid-cols-2 gap-12">
        <ContactInfoCards />
        <BusinessHoursCard />
      </div>
      <ContactForm onSubmit={handleSubmit} />
      <FAQAccordion />
      <MapSection />
      <ContactCTA />
    </main>
  );
};

export default Contact;
