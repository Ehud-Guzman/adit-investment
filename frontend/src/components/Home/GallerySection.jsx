import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ITEMS_PER_PAGE = 6;

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
    description: "Laptops at competitive prices"
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
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef(null);

  const filteredItems =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter(item => item.category === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
              onClick={() => handleFilterChange(category)}
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
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {paginatedItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${currentPage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
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
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-full text-sm font-medium border transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-text border-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Item count */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
        </p>
      </div>
    </section>
  );
};

export default GallerySection;
