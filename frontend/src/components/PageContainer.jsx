// src/components/PageContainer.jsx
import { useLocation } from "react-router-dom";

export default function PageContainer({ children }) {
  const location = useLocation();
  
  // Don't apply container to About page
  if (location.pathname === "/about") {
    return children;
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}