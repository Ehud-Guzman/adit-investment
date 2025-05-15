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
  FiHelpCircle
} from "react-icons/fi";

export default function Contact() {
  // Color Scheme
  const colors = {
    primary: "#007A3D", // Safaricom green
    secondary: "#0056B3", // Professional blue
    gradient: "linear-gradient(135deg, #007A3D 0%, #0056B3 100%)",
    lightBg: "#F8FAFC",
    darkText: "#1E293B"
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

  const departments = [
    {
      icon: <FiBriefcase className="w-6 h-6" />,
      title: "Sales",
      desc: "Get pricing and product information",
      contact: "sales@adit.com",
      color: colors.primary
    },
    {
      icon: <FiHelpCircle className="w-6 h-6" />,
      title: "Support",
      desc: "Technical assistance and troubleshooting",
      contact: "support@adit.com",
      color: colors.secondary
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Partnerships",
      desc: "Business development opportunities",
      contact: "partners@adit.com",
      color: "#6B46C1"
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Media",
      desc: "Press and media inquiries",
      contact: "press@adit.com",
      color: "#D97706"
    }
  ];

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div 
          className="absolute inset-0 bg-gradient-to-r opacity-95"
          style={{ background: colors.gradient }}
        ></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              Let's Build Something Great Together
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-3xl mx-auto"
            >
              Whether you have questions about our services or need technical support, our team is ready to assist you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6" style={{ color: colors.darkText }}>Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  Have questions about our ICT solutions? Reach out to our team through any of these channels and we'll be happy to assist you.
                </p>
                
                <div className="space-y-6">
                  {/* Contact Cards */}
                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-3 rounded-lg" style={{ background: colors.primary }}>
                        <FiMail className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-800">Email Us</h3>
                        <p className="text-gray-600 mt-1">adit.investmentlimited@gmail.com</p>
                        <a 
                          href="mailto:adit.investmentlimited@gmail.com" 
                          className="inline-block mt-3 text-sm font-medium hover:underline"
                          style={{ color: colors.secondary }}
                        >
                          Send a message
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-3 rounded-lg" style={{ background: colors.secondary }}>
                        <FiPhone className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-800">Call Us</h3>
                        <p className="text-gray-600 mt-1">+254 733 681 921</p>
                        <a 
                          href="tel:+254733681921" 
                          className="inline-block mt-3 text-sm font-medium hover:underline"
                          style={{ color: colors.primary }}
                        >
                          Call now
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-3 rounded-lg" style={{ background: colors.primary }}>
                        <FiMapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-800">Visit Us</h3>
                        <p className="text-gray-600 mt-1">Busia Town, Kenya</p>
                        <button 
                          className="inline-block mt-3 text-sm font-medium hover:underline"
                          style={{ color: colors.secondary }}
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
                viewport={{ once: true }}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-gray-100">
                    <FiClock className="w-6 h-6" style={{ color: colors.secondary }} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Business Hours</h3>
                    <ul className="space-y-2 text-gray-600">
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
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.darkText }}>Send Us a Message</h2>
                <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you promptly.</p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.primary + '40',
                        focusRing: colors.primary
                      }}
                      placeholder="Your full name"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.primary + '40',
                        focusRing: colors.primary
                      }}
                      placeholder="your.email@example.com"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none transition-all bg-white"
                      style={{ 
                        borderColor: colors.primary + '40',
                        focusRing: colors.primary
                      }}
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
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message*</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.primary + '40',
                        focusRing: colors.primary
                      }}
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
                      style={{ background: colors.gradient }}
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

      {/* Departments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.darkText }}>Contact Our Departments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect directly with the right team for your specific needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg mr-4" style={{ background: dept.color + '20' }}>
                    {dept.icon}
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: dept.color }}>{dept.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{dept.desc}</p>
                <a 
                  href={`mailto:${dept.contact}`} 
                  className="text-sm font-medium hover:underline"
                  style={{ color: dept.color }}
                >
                  {dept.contact}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.darkText }}>Frequently Asked Questions</h2>
            <p className="text-gray-600">
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
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium" style={{ color: colors.darkText }}>{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${activeFAQ === index ? 'rotate-180' : ''}`}
                    style={{ color: colors.primary }}
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
                      className="px-6 pb-6 text-gray-600"
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
      <section id="location" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.darkText }}>Our Location</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit our office in Busia Town for face-to-face consultations
            </p>
          </motion.div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            <div className="p-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: colors.primary }}>ADIT Investment Limited</h3>
                  <p className="text-gray-600">Busia Town, Kenya</p>
                </div>
                <a
                  href="https://maps.google.com?q=ADIT+Investment+Limited,Busia+Town"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 md:mt-0 px-6 py-2 rounded-lg font-medium text-white hover:shadow-md transition-all"
                  style={{ background: colors.gradient }}
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: colors.gradient }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-white/90 mb-8 text-xl">
              Contact us today to discuss how our ICT solutions can drive your success
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="tel:+254733681921"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                style={{ color: colors.primary }}
              >
                Call Now
              </motion.a>
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-white rounded-lg font-medium text-white hover:bg-white/10 transition-all"
              >
                Send Message
              </motion.a>
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