import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = ['repairs', 'installation', 'selling', 'maintenance'];

const galleryItems = [
  // 🔧 Repairs
  {
    id: 1,
    title: "Computer Repair",
    category: "repairs",
    image: "/assets/images/laptop repair.jpg",
    description: "Expert computer hardware repair services"
  },
  {
    id: 2,
    title: "Printer Repair",
    category: "repairs",
    image: "/assets/images/services/printer repair.jpg",
    description: "Efficient and reliable printer repairs"
  },
  {
    id: 3,
    title: "Desktop Repair",
    category: "repairs",
    image: "/assets/images/services/desktopmaintenance.jpg",
    description: "Quick fixes and diagnostics for desktop PCs"
  },

  // 🛠️ Installations
  {
    id: 4,
    title: "Office Network Setup",
    category: "installation",
    image: "/assets/images/services/network installation.jpg",
    description: "Professional office network installation"
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
    title: "CCTV Installation",
    category: "installation",
    image: "/assets/images/services/cctv.jpg",
    description: "Complete CCTV installation solutions"
  },
  {
    id: 7,
    title: "Server Installation",
    category: "installation",
    image: "/assets/images/services/serverinstallation.jpg",
    description: "On-prem and cloud server setups tailored to your biz"
  },
  {
    id: 8,
    title: "Workstation Setup",
    category: "installation",
    image: "/assets/images/services/workstation.jpg",
    description: "Powerful workstation configurations for professionals"
  },
  {
    id: 9,
    title: "Computer Lab Setup",
    category: "installation",
    image: "/assets/images/services/computerlab.jpg",
    description: "Custom computer labs for schools and businesses"
  },

  // 🛒 Selling
  {
    id: 10,
    title: "Laptop Sales",
    category: "selling",
    image: "/assets/images/services/laptop sales.jpg",
    description: "Brand new laptops at competitive prices"
  },
  {
    id: 11,
    title: "CCTV Systems",
    category: "selling",
    image: "/assets/images/services/cctv.jpg",
    description: "Advanced surveillance systems for all needs"
  },
  {
    id: 12,
    title: "Desktop Computers",
    category: "selling",
    image: "/assets/images/services/desktopcomputer.jpg",
    description: "Top-tier desktops for office and personal use"
  },
  {
    id: 13,
    title: "Network Switches",
    category: "selling",
    image: "/assets/images/services/networkswitch.jpg",
    description: "Enterprise-grade switches for scalable networks"
  },
  {
    id: 14,
    title: "Storage Devices",
    category: "selling",
    image: "/assets/images/services/storagedevices.jpg",
    description: "High-speed SSDs, HDDs and external storage"
  },

  // 🧰 Maintenance
  {
    id: 15,
    title: "Laptop Maintenance",
    category: "maintenance",
    image: "/assets/images/services/laptop-maintenace.jpg",
    description: "Regular servicing for optimal laptop performance"
  },
  {
    id: 16,
    title: "Printer Maintenance",
    category: "maintenance",
    image: "/assets/images/services/printer repair 2.jpg",
    description: "Scheduled checkups and fixes for printers"
  },
  {
    id: 17,
    title: "Server Maintenance",
    category: "maintenance",
    image: "/assets/images/services/servermaintainance.jpg",
    description: "Keep your servers running with zero downtime"
  },
  {
    id: 18,
    title: "Desktop Maintenance",
    category: "maintenance",
    image: "/assets/images/services/desktopmaintenance.jpg",
    description: "Ensure your desktops stay smooth and secure"
  },
  {
    id: 19,
    title: "CCTV System Maintenance",
    category: "maintenance",
    image: "/assets/images/services/cctvmaintenance.jpg",
    description: "Regular inspection and upkeep of surveillance systems"
  }
];







const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems =
    activeFilter === 'all'
      ? categories
          .map(cat => galleryItems.find(item => item.category === cat))
          .filter(Boolean)
      : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light text-dark relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-primary">Work</span> Gallery
          </h2>
          <p className="text-lg text-text">
            See our recent work across all service categories
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', ...categories].map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full font-medium capitalize transition-colors duration-300 border ${
                activeFilter === category
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-text border-gray-300 hover:bg-muted'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="w-full h-60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-secondary text-sm">{item.description}</p>
                <span className="mt-2 px-3 py-1 text-xs bg-white text-primary font-semibold rounded-full capitalize w-max">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
