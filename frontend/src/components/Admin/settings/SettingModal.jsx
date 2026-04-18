import React, { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import api from "@/services/api/index";
import { toastGuard } from "@/utils/toastControl";

export default function SettingModal({ isOpen, onClose, setting, refetch }) {
  const isEdit = Boolean(setting);
  const [formData, setFormData] = useState({ key: "", value: "" });
  const [loading, setLoading] = useState(false);
  const valueInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(setting ? { key: setting.key, value: setting.value } : { key: "", value: "" });
      // Focus the relevant input after the modal renders
      setTimeout(() => valueInputRef.current?.focus(), 50);
    }
  }, [isOpen, setting]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.key.trim() || !formData.value.trim()) {
      return toastGuard.once("setting-invalid", "Both fields are required", "error");
    }
    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/settings/${setting._id}`, { value: formData.value });
        toastGuard.once("setting-updated", "Setting updated", "success");
      } else {
        await api.post("/settings", formData);
        toastGuard.once("setting-created", "Setting created", "success");
      }
      refetch();
      onClose();
    } catch (err) {
      toastGuard.once(
        "setting-fail",
        err?.response?.data?.message || "Failed to save setting",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">
            {isEdit ? "Edit Setting" : "New Setting"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Key</label>
            <input
              name="key"
              value={formData.key}
              onChange={handleChange}
              disabled={isEdit}
              placeholder="e.g. homepage_banner"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
            <input
              ref={valueInputRef}
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="e.g. https://cdn.site/banner.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
