// src/layout/Footer/Footer.jsx
import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterServices from "./FooterServices";
import FooterContact from "./FooterContact";
import FooterBottom from "./FooterBottom";
import WhatsAppCTA from "./WhatsAppCTA";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-white via-[#e6fdf3] to-[#d4fbe1] text-gray-800 pt-12 pb-8 border-t border-gray-200 shadow-inner transition-all duration-500">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FooterBrand />
        <FooterLinks />
        <FooterServices />
        <FooterContact />
      </div>

      <FooterBottom />
      <WhatsAppCTA />
    </footer>
  );
}
