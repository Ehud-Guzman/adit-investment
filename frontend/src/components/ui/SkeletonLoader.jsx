import React from "react";

const SkeletonLoader = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />
);

export default SkeletonLoader;
