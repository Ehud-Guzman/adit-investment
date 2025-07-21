import React, { useEffect, useState } from "react";
import api from "@/services/api/index";
import { safeToast } from "@/utils/toastManager";

export default function SettingModal({ isOpen, onClose, setting, refetch }) {
  const isEdit = Boolean(setting);
  const [formData, setFormData] = useState({ key: "", value: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (setting) {
      setFormData({ key: setting.key, value: setting.value });
    } else {
      setFormData({ key: "", value: "" });
    }
  }, [setting]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.key || !formData.value) {
      return safeToast("setting-invalid", "Both fields are required", "error");
    }

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/settings/${setting._id}`, { value: formData.value });
        safeToast("setting-update", "Setting updated", "success");
      } else {
        await api.post("/settings", formData);
        safeToast("setting-create", "Setting created", "success");
      }
      refetch();
      onClose();
    } catch (err) {
      console.error(err);
      safeToast("setting-fail", "Failed to save setting", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-md w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit Setting" : "New Setting"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Key</label>
            <input
              name="key"
              value={formData.key}
              onChange={handleChange}
              disabled={isEdit}
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              placeholder="e.g. homepage_banner"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Value</label>
            <input
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              placeholder="e.g. https://cdn.site/banner.jpg"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
