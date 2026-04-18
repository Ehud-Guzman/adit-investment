import { useState } from "react";
import { FiEdit, FiTrash2, FiStar, FiX, FiCheckCircle, FiCircle } from "react-icons/fi";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { patchProduct } from "@/services/api/products"; // 🧠 Create this if not done

export default function ProductRow({ product, onEdit, onDelete, refetch }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [toggling, setToggling] = useState({ featured: false, approved: false });

  const imageUrl = product?.images?.[0] || "/placeholder.png";
  const stockLevel = product?.stock ?? 0;

  const stockBadge =
    stockLevel > 10
      ? "bg-green-100 text-green-800"
      : stockLevel > 0
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  const handleToggle = async (field) => {
    try {
      setToggling((prev) => ({ ...prev, [field]: true }));
      const updatedValue = !product[field];
      await patchProduct(product._id, { [field]: updatedValue });
      toast.success(`${field === "approved" ? "Approval" : "Featured"} updated`);
      refetch?.(); // Optional cache refresh
    } catch (err) {
      console.error(`Failed to toggle ${field}`, err);
      toast.error(`Failed to update ${field}`);
    } finally {
      setToggling((prev) => ({ ...prev, [field]: false }));
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 align-middle transition-all duration-150">
        {/* 🖼️ Product Info */}
        <td className="px-4 py-3 max-w-xs">
          <div className="flex items-center gap-3">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-10 h-10 rounded object-cover border border-gray-200"
            />
            <div className="min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {product.name}
              </div>
              {product.description && (
                <div className="text-sm text-gray-500 truncate">
                  {product.description}
                </div>
              )}
            </div>
          </div>
        </td>

        {/* 🗂️ Category */}
        <td className="px-4 py-3">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full truncate max-w-[120px] inline-block">
            {product.category || "Uncategorized"}
          </span>
        </td>

        {/* 💸 Price */}
        <td className="px-4 py-3 font-medium text-sm">
          Ksh{" "}
          {parseFloat(product.price).toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>

        {/* 📦 Stock */}
        <td className="px-4 py-3">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${stockBadge}`}>
            {stockLevel} in stock
          </span>
        </td>

        {/* 🧑‍💼 Vendor */}
        <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[120px]">
          {product.vendor || <span className="text-gray-400 italic">—</span>}
        </td>

        {/* 🔖 Status */}
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => handleToggle("approved")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                product.approved
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }`}
              disabled={toggling.approved}
            >
              {toggling.approved ? (
                <span className="w-3 h-3 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
              ) : product.approved ? (
                <>
                  <FiCheckCircle size={12} /> Approved
                </>
              ) : (
                <>
                  <FiCircle size={12} /> Pending
                </>
              )}
            </button>

            <button
              onClick={() => handleToggle("featured")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                product.featured
                  ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              disabled={toggling.featured}
            >
              {toggling.featured ? (
                <span className="w-3 h-3 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></span>
              ) : (
                <>
                  <FiStar size={12} />
                  {product.featured ? "Featured" : "Feature"}
                </>
              )}
            </button>
          </div>
        </td>

        {/* ⚙️ Actions */}
        <td className="px-4 py-3">
          <div className="flex justify-end gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Edit"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* 🧨 Confirm Deletion Modal */}
      {showConfirm &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg text-gray-800">
                    Delete “{product.name}”?
                  </h3>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mt-2 mb-4">
                  This action cannot be undone. The product will be permanently removed.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowConfirm(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
