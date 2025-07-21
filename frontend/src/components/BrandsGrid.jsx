const BrandsGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {children}
    </div>
  );
};

export default BrandsGrid;