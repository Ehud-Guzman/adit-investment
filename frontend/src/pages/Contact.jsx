import ContactHero from "@/componentsContactContactHero";
import ContactInfoCards from "@/componentsContactContactInfoCards";
import BusinessHoursCard from "@/componentsContact/BusinessHoursCard";
import ContactForm from "@/componentsContactContactForm";
import { showContactToast } from "@/componentsContactContactToast";
import FAQAccordion from "@/componentsContact/FAQAccordion";
import MapSection from "@/componentsContact/MapSection";
import ContactCTA from "@/componentsContactContactCTA";

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
