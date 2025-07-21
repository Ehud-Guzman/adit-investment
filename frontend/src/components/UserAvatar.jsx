// components/UserAvatar.jsx
import React, { useState } from "react";
import { getUserInitials } from "../utils/getUserInitials";

const UserAvatar = ({ 
  user, 
  size = "md", // sm, md, lg, xl
  border = true,
  shadow = true,
  hoverEffect = true,
  className = "",
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (!user) return null;

  const initials = getUserInitials(user.name);
  
  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };

  // Color gradient based on user status
  const getGradient = () => {
    if (user.isAdmin) {
      return "bg-gradient-to-tr from-amber-500 to-red-500";
    }
    return "bg-gradient-to-tr from-blue-600 to-purple-500";
  };

  // Container classes
  const containerClasses = [
    "rounded-full",
    "flex items-center justify-center",
    "font-semibold select-none",
    getGradient(),
    sizeClasses[size],
    border ? "border-2 border-white ring-2 ring-blue-200" : "",
    shadow ? "shadow-lg" : "",
    hoverEffect ? "hover:scale-105 transition-transform duration-200" : "",
    className
  ].filter(Boolean).join(" ");

  // Render image if available and no error
  if (user.image && !imageError) {
    return (
      <div 
        className={containerClasses}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        aria-label={user.name}
      >
        <img 
          src={user.image} 
          alt={user.name} 
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Render initials fallback
  return (
    <div 
      className={containerClasses}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={user.name}
    >
      <span className="text-white drop-shadow-sm">{initials}</span>
    </div>
  );
};

export default UserAvatar;