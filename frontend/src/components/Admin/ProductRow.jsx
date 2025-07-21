import { useState } from "react";
import { FiEdit, FiTrash2, FiStar, FiCheck, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

export default function ProductRow({ product, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 align-middle">
        {/* Product Info */}
        <td className="px-4 py-3 max-w-xs">
          <div className="flex items-center gap-3">
            <img
              src={product.images?.[0] || "/placeholder.png"}
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

        {/* Category */}
        <td className="px-4 py-3">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full truncate max-w-[120px] inline-block">
            {product.category}
          </span>
        </td>

        {/* Price */}
        <td className="px-4 py-3 font-medium text-sm">
          Ksh{" "}
          {parseFloat(product.price).toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>

        {/* Stock */}
        <td className="px-4 py-3">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              product.stock > 10
                ? "bg-green-100 text-green-800"
                : product.stock > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock} in stock
          </span>
        </td>

        {/* Vendor */}
        <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[120px]">
          {product.vendor || "-"}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                product.approved
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {product.approved ? "Approved" : "Pending"}
            </span>
            {product.isFeatured && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <FiStar className="mr-1" size={12} /> Featured
              </span>
            )}
          </div>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex justify-end gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Edit product"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete product"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal via Portal */}
      {showConfirm &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">
                    Delete "{product.name}"?
                  </h3>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mt-2 mb-4">
                  This action cannot be undone. All product data will be
                  permanently removed.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowConfirm(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
