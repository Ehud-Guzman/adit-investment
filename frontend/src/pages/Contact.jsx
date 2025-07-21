import ContactHero from "@/components/contact/ContactHero";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import BusinessHoursCard from "@/components/contact/BusinessHoursCard";
import ContactForm from "@/components/contact/ContactForm";
import { showContactToast } from "@/components/contact/ContactToast";
import FAQAccordion from "@/components/contact/FAQAccordion";
import MapSection from "@/components/contact/MapSection";
import ContactCTA from "@/components/contact/ContactCTA";

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
