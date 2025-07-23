import { useState, useEffect } from "react";
import { FiFilter, FiSearch, FiChevronDown, FiX } from "react-icons/fi";

const CATEGORIES = [
  { value: "all", label: "All Categories", icon: "🛒" },
  { value: "printers", label: "Printers", icon: "🖨️" },
  { value: "computers", label: "Computers", icon: "🖥️" },
  { value: "laptops", label: "Laptops", icon: "💻" },
  { value: "monitors", label: "Monitors", icon: "🖥️" },
  { value: "accessories", label: "Accessories", icon: "⌨️" },
  { value: "storage", label: "Storage", icon: "💾" },
  { value: "toners", label: "Toners", icon: "🖨️" },
  { value: "cartridge", label: "Cartridge", icon: "🖨️" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured", icon: "⭐" },
  { value: "price-low", label: "Price: Low to High", icon: "⬆️" },
  { value: "price-high", label: "Price: High to Low", icon: "⬇️" },
  { value: "name-asc", label: "Name: A-Z", icon: "🔤" },
  { value: "name-desc", label: "Name: Z-A", icon: "🔠" },
  { value: "rating-high", label: "Highest Rated", icon: "🌟" },
  { value: "newest", label: "Newest Arrivals", icon: "🆕" },
];

const ITEMS_PER_PAGE_OPTIONS = [
  { value: 12, label: "12 Items" },
  { value: 24, label: "24 Items" },
  { value: 48, label: "48 Items" },
  { value: 96, label: "96 Items" },
];

const Filters = ({
  category = "all",
  setCategory = () => {},
  sortBy = "featured",
  setSortBy = () => {},
  currentPage = 1,
  setCurrentPage = () => {},
  onSearch = () => {},
  itemsPerPage = 12,
  setItemsPerPage = () => {},
  isScrolled = false,
  totalItems = 0,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 400); // Debounced
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleCategoryChange = (cat) => {
    if (cat !== category) {
      setCategory(cat);
      setCurrentPage(1);
      setSearchTerm("");
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setMobileSearchOpen(false);
    onSearch("");
  };

  return (
    <div
      className={`transition-all duration-300 z-[80] w-full rounded-2xl shadow-sm px-4 sm:px-6 py-4 sm:py-5 mb-6 border border-blue-100 backdrop-blur-md bg-white/80 ${
        isScrolled ? "top-[84px]" : "mt-4"
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        {/* Mobile Buttons */}
        <div className="flex gap-2 w-full md:hidden">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <FiFilter />
            {filtersOpen ? "Hide Filters" : "Filters"}
          </button>

          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <FiSearch />
            Search
          </button>
        </div>

        {/* Desktop Filters + Search */}
        <div className="hidden md:flex flex-wrap gap-3 w-full md:w-auto items-center">
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {mobileSearchOpen && (
        <div className="md:hidden relative mb-4">
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3 text-gray-800" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm text-black-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-700"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div
        className={`${filtersOpen ? "block" : "hidden md:block"} mb-2 md:mb-4`}
      >
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => handleCategoryChange(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            items
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
