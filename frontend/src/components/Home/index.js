import FloatingElements from './FloatingElements';
import AboutSection from './AboutSection';
import GallerySection from './GallerySection';
import CTASection from './CTASection';
import ServiceSection from './ServiceSection/ServiceSection';

const Home = () => {
  return (
    <div className="relative bg-dark text-white overflow-hidden">
      <FloatingElements />
      <AboutSection />
      <ServiceSection />
      <GallerySection />
      <CTASection />
    </div>
  );
};

export default Home;
