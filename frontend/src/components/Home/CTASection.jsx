import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-accent text-white text-center relative overflow-hidden shadow-xl mb-24 rounded-3xl max-w-6xl mx-auto">

      {/* Background pattern with rounded corners */}
      <div className="absolute inset-0 opacity-10 bg-[url('/assets/images/pattern.svg')] bg-cover bg-center rounded-3xl pointer-events-none"></div>

      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5"></div>
      <div className="absolute -bottom-12 -left-16 w-48 h-48 rounded-full bg-white/5"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-md"
        >
          Ready to Transform Your Business?
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
        >
          Contact us today for a free consultation and discover the perfect ICT solutions for your needs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.a
            whileHover={{ 
              scale: 1.05,
              backgroundColor: '#ffffff',
              color: '#2563eb'
            }}
            whileTap={{ scale: 0.95 }}
            href="mailto:adit.investmentlimited@gmail.com"
            className="inline-block px-8 py-4 rounded-xl font-semibold border-2 border-white text-primary bg-white hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Email: adit.investmentlimited@gmail.com
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;