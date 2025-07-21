import React, { useState } from 'react';
import BrandCard from './BrandCard';
import BrandSearch from './BrandSearch';
import BrandsGrid from './BrandsGrid';

const BrandsSection = ({ 
  brands: initialBrands = [], 
  onBrandSelect,
  title = "Our Trusted Brands",
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const defaultBrands = [
    { id: 1, name: 'Canon', slug: 'canon', logo: '/brands/canon.png' },
    { id: 2, name: 'Samsung', slug: 'samsung', logo: '/brands/samsung.avif' },
    { id: 3, name: 'HP', slug: 'hp', logo: '/brands/hp-logo.svg' },
    { id: 4, name: 'Dell', slug: 'dell', logo: '/brands/dell.png' },
    { id: 5, name: 'Lenovo', slug: 'lenovo', logo: '/brands/lenovo.png' },
    { id: 6, name: 'Asus', slug: 'asus', logo: '/brands/asus.png' },
    { id: 7, name: 'Epson', slug: 'epson', logo: '/brands/epson-logo.png' },
    { id: 8, name: 'Dahua', slug: 'dahua', logo: '/brands/dahua.png' },
    { id: 9, name: 'TP-Link', slug: 'tp-link', logo: '/brands/tp-link.png' },
    { id: 10, name: 'Microsoft', slug: 'microsoft', logo: '/brands/microsoft.png' },
  ];

  const brands = initialBrands.length > 0 ? initialBrands : defaultBrands;

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="relative mb-8">
          {/* Always centered title */}
          <h2 className="text-3xl font-bold text-gray-900 text-center">{title}</h2>

          {/* Desktop search (right aligned) */}
          <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2">
            <BrandSearch value={searchTerm} onChange={setSearchTerm} />
          </div>

          {/* Mobile search (below title) */}
          <div className="mt-4 md:hidden">
            <BrandSearch value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>

        {/* Brand Cards Grid */}
        <BrandsGrid>
          {filteredBrands.map((brand) => (
            <BrandCard 
              key={brand.id || brand.name} 
              brand={brand} 
              onBrandSelect={onBrandSelect} 
            />
          ))}
        </BrandsGrid>
      </div>
    </section>
  );
};

export default BrandsSection;
