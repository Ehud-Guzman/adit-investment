import ServiceCard from './ServiceCard';
import { FiLayers, FiMonitor, FiSmartphone } from 'react-icons/fi';

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

const SecurityServices = () => (
  <div>
    <h3 className="text-2xl font-bold text-dark mb-8">
      Security & Business Solutions
    </h3>
    <div className="grid md:grid-cols-3 gap-8">
      {securityServices.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  </div>
);

export default SecurityServices;
