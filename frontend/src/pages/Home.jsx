import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiServer, FiCode, FiPrinter, FiWifi, FiShoppingCart, FiLayers, FiGlobe, FiDatabase, FiMonitor, FiSmartphone, FiMail, FiUsers, FiMapPin, FiClock, FiPhone } from 'react-icons/fi';

// Gallery data - placed outside the component
const galleryItems = [
  {
    id: 1,
    title: "Computer Repair",
    category: "repairs",
    image: "/assets/images/laptop repair.jpg",
    description: "Expert computer hardware repair services"
  },
  {
    id: 2,
    title: "Office Network Setup",
    category: "installation",
    image: "/assets/images/services/network installation.jpg",
    description: "Professional office network installation"
  },
  {
    id: 3,
    title: "Laptop Sales",
    category: "selling",
    image: "/assets/images/services/laptop sales.jpg",
    description: "Brand new laptops at competitive prices"
  },
  {
    id: 4,
    title: "Printer Maintenance",
    category: "maintenance",
    image: "/assets/images/services/printer repair.jpg",
    description: "Regular printer servicing and maintenance"
  },
  {
    id: 5,
    title: "Software Installation",
    category: "installation",
    image: "/assets/images/services/windows insall.jpg",
    description: "Professional software installation services"
  },
  {
    id: 6,
    title: "Security Camera Setup",
    category: "installation",
    image: "/assets/images/services/cctv.jpg",
    description: "Complete CCTV installation solutions"
  }
];

export default function Home() {
  const colors = {
    primary: "#007A3D", // Safaricom green
    secondary: "#0056B3", // Professional blue
    gradient: "linear-gradient(135deg, #007A3D 0%, #0056B3 100%)",
    lightBg: "#F8FAFC",
    darkBg: "#0F172A"
  };

  // Services data
 
  const hardwareServices = [
    {
      title: "ICT Equipment Sales",
      icon: <FiShoppingCart className="w-6 h-6" />,
      description: "Premium devices at competitive prices",
      features: [
        "Laptops & Desktops",
        "Printers & Copiers",
        "Genuine toners",
        "Networking gear",
        "Accessories"
      ],
      image: "/equipment.jpg"
    },
    {
      title: "Repair & Maintenance",
      icon: <FiPrinter className="w-6 h-6" />,
      description: "Expert technical support",
      features: [
        "Computer repairs",
        "Printer servicing",
        "Data recovery",
        "Virus removal",
        "Preventive maintenance"
      ],
      image: "/repair.jpg"
    },
    {
      title: "Networking Solutions",
      icon: <FiWifi className="w-6 h-6" />,
      description: "Reliable connectivity solutions",
      features: [
        "Structured cabling",
        "Wi-Fi installation",
        "VPN setup",
        "Network security",
        "ISP coordination"
      ],
      image: "/networking.jpg"
    }
  ];

   const coreServices = [
    {
      title: "Web Development",
      icon: <FiGlobe className="w-6 h-6" />,
      description: "Responsive, modern websites that convert visitors to customers",
      features: [
        "Custom website design",
        "E-commerce solutions",
        "CMS integration",
        "SEO optimization",
        "Mobile-responsive"
      ],
      image: "/assets/images/services/web design.jpg"
    },
    {
      title: "Domain & Hosting",
      icon: <FiServer className="w-6 h-6" />,
      description: "Complete online presence solutions",
      features: [
        ".com, .co.ke, .org domains",
        "Email hosting",
        "SSL certificates",
        "99.9% uptime",
        "24/7 support"
      ],
      image: "services\network installation.jpg"
    },
    {
      title: "Database Solutions",
      icon: <FiDatabase className="w-6 h-6" />,
      description: "Custom database systems for your business",
      features: [
        "Inventory systems",
        "Client management",
        "School systems",
        "Data migration",
        "API integration"
      ],
      image: "/database.jpg"
    }
  ];


  const securityServices = [
    {
      title: "Security Systems",
      icon: <FiLayers className="w-6 h-6" />,
      description: "Comprehensive protection solutions",
      features: [
        "CCTV installation",
        "Access control",
        "Alarm systems",
        "Vehicle tracking",
        "Remote monitoring"
      ],
      image: "/security.jpg"
    },
    {
      title: "Cloud Services",
      icon: <FiMonitor className="w-6 h-6" />,
      description: "Secure cloud solutions",
      features: [
        "Cloud storage",
        "Backup solutions",
        "Virtual servers",
        "Office 365",
        "Google Workspace"
      ],
      image: "/cloud.jpg"
    },
    {
      title: "Branding & Design",
      icon: <FiSmartphone className="w-6 h-6" />,
      description: "Professional brand identity",
      features: [
        "Logo design",
        "Business cards",
        "Letterheads",
        "Social media kits",
        "Marketing materials"
      ],
      image: "/branding.jpg"
    }
  ];

  // Gallery filter state
  const [activeFilter, setActiveFilter] = useState('all');
  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="relative bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Innovative ICT Solutions
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10">
              Empowering businesses in Kenya and East Africa with cutting-edge technology services tailored to your needs
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
           
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg font-bold border-2 border-white border-opacity-30 hover:border-opacity-60 text-white transition-all"
              >
                Call: +254 733 681 921
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                About <span style={{ color: colors.primary }}>ADIT Investment</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                ADIT Investment Limited is your trusted partner for innovative ICT solutions in Kenya and East Africa. We combine technical expertise with a deep understanding of local business needs.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Based in Busia and operating region-wide, we're committed to delivering affordable, high-quality services that drive your digital transformation.
              </p>
              <div className="space-y-4">
                {[
                  "10+ years industry experience",
                  "Certified technicians",
                  "Genuine products guarantee",
                  "24/7 customer support"
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-lg text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full max-w-2x1  aspect-h-9 rounded-2xl overflow-hidden shadow-2xl bg-gray-800 mx-auto group transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(72,187,120,0.7)]">
                <img 
                  src="/assets/images/services/adit cover photo.jpg" 
                  alt="ADIT Investment Office" 
                  className="w-full h-full object-cover transition-all -500 group-hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Our <span style={{ color: colors.primary }}>Comprehensive</span> Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              End-to-end technology solutions designed to power your business in the digital age
            </p>
          </div>

         

          {/* Hardware Services */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold mb-8 text-white">
              Hardware & Infrastructure
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {hardwareServices.map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-6">
                      {service.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{service.title}</h4>
                    <p className="text-gray-300 mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

           {/* Software Services */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold mb-8 text-white">
              Software & Digital Solutions
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {coreServices.map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mb-6">
                      {service.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{service.title}</h4>
                    <p className="text-gray-300 mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Security & Other Services */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-white">
              Security & Business Solutions
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {securityServices.map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mb-6">
                      {service.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{service.title}</h4>
                    <p className="text-gray-300 mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Our <span className="text-green-500">Work</span> Gallery
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See our work in different service categories
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'repairs', 'installation', 'selling', 'maintenance'].map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full font-medium capitalize ${
                  activeFilter === category
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredItems.map((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl shadow-lg"
    >
      <div className="relative w-full h-60 bg-gray-800"> {/* Fixed height for uniformity */}
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
        <p className="text-green-400 text-sm">{item.description}</p>
        <span className="mt-2 inline-block px-3 py-1 bg-gray-800 text-xs text-white rounded-full capitalize">
          {item.category}
        </span>
      </div>
    </motion.div>
  ))}
</div>


          {/* View More button */}
          <div className="text-center mt-12">
        
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Contact us today for a free consultation and discover the perfect ICT solutions for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-bold text-white shadow-lg"
              style={{ background: colors.gradient }}
            >
              Request Consultation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-bold border-2 border-white border-opacity-30 hover:border-opacity-60 text-white transition-all"
            >
              Email: adit.investmentlimited@gmail.com
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}