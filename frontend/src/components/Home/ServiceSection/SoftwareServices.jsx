// /components/Home/ServiceSection/SoftwareServices.jsx
import { FiGlobe, FiServer, FiDatabase } from 'react-icons/fi';
import ServiceCard from './ServiceCard';

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
    ]
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
    ]
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
    ]
  }
];

export default function SoftwareServices() {
  return (
    <div className="mb-20">
      <h3 className="text-2xl font-bold mb-8 text-black">
        Software & Digital Solutions
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        {coreServices.map((service, index) => (
          <ServiceCard key={index} {...service} hoverBorderColor="border-green-500" />
        ))}
      </div>
    </div>
  );
}
