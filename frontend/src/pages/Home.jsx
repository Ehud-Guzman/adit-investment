import FloatingElements from '@/components/Home/FloatingElements';
import AboutSection from '@/components/Home/AboutSection';
import ServiceSection from '@/components/Home/ServiceSection/ServiceSection';
import GallerySection from '@/components/Home/GallerySection';
import CTASection from '@/components/Home/CTASection';
import ProductPromoSection from "@/components/Home/ProductPromoSection";

export default function Home() {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Floating Blobs */}
      <FloatingElements />

      {/* About Us */}
      <AboutSection />

      {/* Our Services (Hardware, Software, Security) */}
      <ServiceSection />

      {/* Work Gallery */}
      <GallerySection />

      <ProductPromoSection />

      {/* Final Call-To-Action */}
      <CTASection />
    </div>
  );
}
