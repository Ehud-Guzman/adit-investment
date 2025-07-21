import React from "react";

const SkeletonLoader = ({ className }) => {
  return (
    <div 
      className={`bg-gray-100 animate-pulse ${className}`}
    />
  );
};

export default SkeletonLoader;