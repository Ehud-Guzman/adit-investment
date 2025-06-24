import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSend, 
  FiCheckCircle, 
  FiAlertCircle,
  FiClock,
  FiUsers,
  FiGlobe,
  FiBriefcase,
  FiHelpCircle,
  FiArrowRight
} from "react-icons/fi";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  // Techy gradient colors
  const colors = {
    primary: '#00f2c3',
    secondary: '#0098f0',
    accent: '#6e45e2',
    dark: '#0f172a',
    light: '#f8fafc'
  };

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", message: "", subject: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      formRef.current.reset();
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };



  const faqs = [
    {
      question: "What are your business hours?",
      answer: "Our team is available Monday to Friday from 8:00 AM to 5:00 PM EAT. We're closed on weekends and public holidays."
    },
    {
      question: "How quickly can I expect a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line."
    },
    {
      question: "Do you offer on-site consultations?",
      answer: "Yes, we provide on-site consultations for businesses in Nairobi and surrounding areas. Remote consultations are available for other locations."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, M-Pesa, bank transfers, and cheques. International clients can pay via wire transfer."
    }
  ];

  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              transition: {
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-blue-500/10 to-purple-500/20 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400"
          >
            Let's Build <span className="text-white">Something Great</span> Together
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Whether you have questions about our services or need technical support, our team is ready to assist you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="#contact-form"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Send Us a Message <FiArrowRight />
            </motion.a>
            <motion.a
              href="tel:+254733681921"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-medium border-2 border-gray-600 hover:border-cyan-400 text-white hover:text-cyan-400 transition-all flex items-center gap-2"
            >
              <FiPhone /> Call Now
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 mr-4"></div>
                  <span className="text-cyan-400 font-medium">GET IN TOUCH</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Connect With Our Team</h2>
                <p className="text-lg text-gray-300 mb-8">
                  Have questions about our ICT solutions? Reach out through any of these channels and we'll be happy to assist you.
                </p>
                
                <div className="space-y-6">
                  {/* Contact Cards */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="p-6 bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-700/50 hover:border-cyan-400/30"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-3 rounded-lg bg-cyan-500/10">
                        <FiMail className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-white">Email Us</h3>
                        <p className="text-gray-300 mt-1">adit.investmentlimited@gmail.com</p>
                        <a 
                          href="mailto:adit.investmentlimited@gmail.com" 
                          className="inline-block mt-3 text-sm font-medium hover:underline text-cyan-400"
                        >
                          Send a message
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-700/50 hover:border-blue-400/30"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500/10">
                        <FiPhone className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-white">Call Us</h3>
                        <p className="text-gray-300 mt-1">+254 733 681 921</p>
                        <a 
                          href="tel:+254733681921" 
                          className="inline-block mt-3 text-sm font-medium hover:underline text-blue-400"
                        >
                          Call now
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="p-6 bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-700/50 hover:border-purple-400/30"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500/10">
                        <FiMapPin className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-white">Visit Us</h3>
                        <p className="text-gray-300 mt-1">Busia Town, Kenya</p>
                        <button 
                          className="inline-block mt-3 text-sm font-medium hover:underline text-purple-400"
                          onClick={() => document.getElementById('location').scrollIntoView({ behavior: 'smooth' })}
                        >
                          View on map
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className="p-6 bg-gray-800/50 rounded-xl shadow-sm border border-gray-700/50"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500/10">
                    <FiClock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white mb-2">Business Hours</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-medium">8:00 AM - 5:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday</span>
                        <span className="font-medium">Closed</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sunday</span>
                        <span className="font-medium">Closed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50 backdrop-blur-sm"
              id="contact-form"
            >
              <div className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Send Us a Message</h2>
                <p className="text-gray-300 mb-6">Fill out the form below and we'll get back to you promptly.</p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name*</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:outline-none transition-all focus:border-cyan-400 focus:ring-cyan-400/30"
                      placeholder="Your full name"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:outline-none transition-all focus:border-cyan-400 focus:ring-cyan-400/30"
                      placeholder="your.email@example.com"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:outline-none transition-all focus:border-cyan-400 focus:ring-cyan-400/30"
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message*</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:outline-none transition-all focus:border-cyan-400 focus:ring-cyan-400/30"
                      placeholder="How can we help you?"
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white shadow-sm transition-all ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:shadow-md"
                      }`}
                      style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <FiSend className="mr-2" /> Send Message
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

     

      {/* FAQ Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-400">
              Find quick answers to common questions about our services and support
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className="bg-gray-800/50 rounded-xl shadow-sm border border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none group"
                >
                  <h3 className="text-lg font-medium text-white group-hover:text-cyan-400 transition-colors">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${activeFAQ === index ? 'rotate-180 text-cyan-400' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {activeFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-gray-300"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section id="location" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Location</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Visit our office in Busia Town for face-to-face consultations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
          >
            <div className="h-96 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.755575058327!2d34.56712331475394!3d0.45799999999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMjcnMjguOCJOIDM0wrAzNCcwNy4wIkU!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="ADIT Investment Location"
              ></iframe>
            </div>
            <div className="p-6 border-t border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-lg font-bold text-cyan-400">ADIT Investment Limited</h3>
                  <p className="text-gray-300">Busia Town, Kenya</p>
                </div>
                <motion.a
                  href="https://maps.google.com?q=ADIT+Investment+Limited,Busia+Town"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 md:mt-0 px-6 py-2 rounded-lg font-medium text-white hover:shadow-md transition-all flex items-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                >
                  <FiMapPin /> Get Directions
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-white/90 mb-8 text-xl">
              Contact us today to discuss how our ICT solutions can drive your success
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="tel:+254733681921"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                style={{ color: colors.primary }}
              >
                <FiPhone /> Call Now
              </motion.a>
              <motion.a
                href="#contact-form"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-white rounded-lg font-medium text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <FiSend /> Send Message
              </motion.a>
            </div>

            <div className="flex justify-center mt-12 space-x-4">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Status Toast */}
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div
              className={`p-4 rounded-lg shadow-lg flex items-center ${
                submitStatus === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {submitStatus === "success" ? (
                <FiCheckCircle className="mr-2 text-xl text-white" />
              ) : (
                <FiAlertCircle className="mr-2 text-xl text-white" />
              )}
              <span className="text-white font-medium">
                {submitStatus === "success"
                  ? "Message sent successfully!"
                  : "Failed to send message. Please try again."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}