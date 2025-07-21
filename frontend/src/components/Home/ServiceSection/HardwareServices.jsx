import ServiceCard from './ServiceCard';
import { FiShoppingCart, FiPrinter, FiWifi } from 'react-icons/fi';

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

const HardwareServices = () => (
  <div>
    <h3 className="text-2xl font-bold text-dark mb-8">
      Hardware & Infrastructure
    </h3>
    <div className="grid md:grid-cols-3 gap-8">
      {hardwareServices.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  </div>
);

export default HardwareServices;
