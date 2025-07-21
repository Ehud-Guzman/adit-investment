import React, { useState } from "react";
import api from "@/services/api/index";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { safeToast } from "@/utils/toastManager";

export default function SettingItem({ setting, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(setting.value);
  const [loading, setLoading] = useState(false);

  const update = async () => {
    try {
      setLoading(true);
      await api.put(`/settings/${setting._id}`, { value });
      safeToast("setting-update", "Updated successfully", "success");
      setIsEditing(false);
      refetch();
    } catch (err) {
      safeToast("setting-update-fail", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this setting?")) return;
    try {
      await api.delete(`/settings/${setting._id}`);
      safeToast("setting-deleted", "Setting removed", "success");
      refetch();
    } catch (err) {
      safeToast("setting-delete-fail", "Delete failed", "error");
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded border flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-700">{setting.key}</p>
        {isEditing ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border px-2 py-1 rounded mt-1 text-sm"
          />
        ) : (
          <p className="text-sm text-gray-600 mt-1">{setting.value}</p>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={update}
              disabled={loading}
              className="text-green-600"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={remove}
              className="text-red-600"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
