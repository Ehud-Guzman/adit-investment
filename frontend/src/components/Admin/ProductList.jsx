import { useState, useMemo } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import ProductRow from "./ProductRow";

export default function ProductList({
  products,
  onEdit,
  onDelete,
  onCreate,
  loading = false,
  error = null,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("name");
  const [filters, setFilters] = useState({
    approved: "all",
    featured: "all",
    vendor: "all",
  });

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const name = product?.name?.toLowerCase?.() || "";
      const category = product?.category?.toLowerCase?.() || "";
      const vendor = product?.vendor?.toLowerCase?.() || "";

      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        category.includes(searchTerm.toLowerCase());

      const matchesApproval =
        filters.approved === "all" ||
        (filters.approved === "approved" && product?.approved) ||
        (filters.approved === "pending" && !product?.approved);

      const matchesFeatured =
        filters.featured === "all" ||
        (filters.featured === "featured" && product?.featured) ||
        (filters.featured === "regular" && !product?.featured);

      const matchesVendor =
        filters.vendor === "all" ||
        vendor === filters.vendor.toLowerCase();

      return matchesSearch && matchesApproval && matchesFeatured && matchesVendor;
    });
  }, [products, searchTerm, filters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === "price") return (a.price || 0) - (b.price || 0);
      if (sortKey === "stock") return (a.stock || 0) - (b.stock || 0);
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [filtered, sortKey]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Dynamically extract unique vendors from products
  const uniqueVendors = useMemo(() => {
    const vendorSet = new Set(products.map((p) => p.vendor).filter(Boolean));
    return Array.from(vendorSet);
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Product Management
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {products.length} Products
            </span>
          </h2>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
          </select>
        </div>

        {/* Search + Create */}
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // reset page on search
              }}
            />
          </div>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md"
          >
            <FiPlus />
            New Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Status:</span>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={filters.approved}
            onChange={(e) => setFilters({ ...filters, approved: e.target.value })}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Featured:</span>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={filters.featured}
            onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
          >
            <option value="all">All</option>
            <option value="featured">Featured</option>
            <option value="regular">Regular</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Vendor:</span>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={filters.vendor}
            onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
          >
            <option value="all">All</option>
            {uniqueVendors.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <div className="text-gray-400 mb-2">No products found</div>
          <p className="text-gray-500">
            {searchTerm ? "Try a different search term" : "Create your first product"}
          </p>
        </div>
      ) : (
        <>
          {/* Product Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginated.map((product, i) => (
                  <ProductRow
                    key={product._id || `fallback-${i}`}
                    product={product}
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product._id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-b-lg">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">{Math.min(page * itemsPerPage, sorted.length)}</span>{" "}
                of <span className="font-medium">{sorted.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
