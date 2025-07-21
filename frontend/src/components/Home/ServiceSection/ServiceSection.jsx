import { motion } from 'framer-motion';
import HardwareServices from './HardwareServices';
import SoftwareServices from './SoftwareServices';
import SecurityServices from './SecurityServices';

const ServiceSection = () => {
  return (
    <section className="bg-muted py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-lg text-textLight">
            Explore our wide range of ICT solutions tailored to grow your business
          </p>
        </motion.div>

        <div className="space-y-20">
          <HardwareServices />
          <SoftwareServices />
          <SecurityServices />
          
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
