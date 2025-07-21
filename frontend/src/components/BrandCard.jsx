import React from 'react';

const BrandCard = ({ brand, onBrandSelect }) => {
  const handleClick = () => {
    if (onBrandSelect) {
      onBrandSelect(brand);
    }
    // You can add navigation logic here if needed
    // window.location.href = `/products?brand=${brand.slug || brand.name.toLowerCase()}`;
  };

  return (
    <div 
      className="group bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200"
      onClick={handleClick}
    >
      {brand.logo ? (
        <div className="relative w-20 h-20 mb-3">
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
          />
        </div>
      ) : (
        <div className="w-16 h-16 mb-3 flex items-center justify-center bg-white rounded-full shadow-sm">
          <span className="text-2xl font-bold text-gray-600">
            {brand.name.charAt(0)}
          </span>
        </div>
      )}
      <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors">
        {brand.name}
      </span>
   
    </div>
  );
};

export default BrandCard;