import { FiX } from "react-icons/fi";

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
  { value: "cctv", label: "CCTV", icon: "📹" },
  { value: "networking", label: "Networking", icon: "🌐" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "rating-high", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
];

const ITEMS_PER_PAGE_OPTIONS = [
  { value: 12, label: "12 / page" },
  { value: 24, label: "24 / page" },
  { value: 48, label: "48 / page" },
  { value: 96, label: "96 / page" },
];

const Filters = ({
  category = "all",
  setCategory = () => {},
  sortBy = "featured",
  setSortBy = () => {},
  currentPage = 1,
  setCurrentPage = () => {},
  itemsPerPage = 24,
  setItemsPerPage = () => {},
  totalItems = 0,
  onClose,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isDirty = category !== "all" || sortBy !== "featured";

  const handleCategoryChange = (val) => {
    setCategory(val);
    setCurrentPage(1);
    onClose?.();
  };

  const clearAll = () => {
    setCategory("all");
    setSortBy("featured");
    setCurrentPage(1);
  };

  return (
    <div className="p-4 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Filters
        </span>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={clearAll}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Sort by */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Items per page */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Per page
        </label>
        <select
          value={itemsPerPage}
          onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ITEMS_PER_PAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Category
        </label>
        <div className="space-y-0.5">
          {CATEGORIES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => handleCategoryChange(value)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                category === value
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {totalItems > 0 && (
        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          {totalItems.toLocaleString()} product{totalItems !== 1 ? "s" : ""}
          {totalPages > 1 && ` · page ${currentPage} of ${totalPages}`}
        </p>
      )}
    </div>
  );
};

export default Filters;
