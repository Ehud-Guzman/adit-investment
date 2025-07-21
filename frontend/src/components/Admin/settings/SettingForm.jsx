import React, { useState, useEffect } from "react";
import { safeToast } from "@/utils/toast";
import { useSettingMutations } from "@/hooks/useSettingMutations";

const SettingForm = ({ initialData, onClose }) => {
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
  });

  const isEditing = Boolean(initialData?._id);
  const { mutateCreate, mutateUpdate, isLoading } = useSettingMutations();

  useEffect(() => {
    if (initialData) {
      setFormData({
        key: initialData.key || "",
        value: initialData.value || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.key || !formData.value) {
      return safeToast("Key and value are required", "error");
    }

    const payload = {
      ...formData,
      _id: initialData?._id,
    };

    if (isEditing) {
      mutateUpdate(payload, { onSuccess: onClose });
    } else {
      mutateCreate(payload, { onSuccess: onClose });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {["key", "value", "description"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium capitalize">{field}</label>
          {field === "description" ? (
            <textarea
              name={field}
              value={formData[field]}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700"
            />
          ) : (
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700"
              required={field !== "description"}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : isEditing ? "Update Setting" : "Create Setting"}
      </button>
    </form>
  );
};

export default SettingForm;
