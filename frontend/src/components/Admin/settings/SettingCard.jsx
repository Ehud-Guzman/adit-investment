import React, { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useSettingMutations } from "@/hooks/useSettingMutations";

const SettingCard = React.memo(({ setting }) => {
  const { canEditSettings } = useAuth();
  const { handleEdit, handleDelete } = useSettingMutations();

  const description = useMemo(
    () => setting.description?.trim() || "No description provided.",
    [setting.description]
  );

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          {setting.key}
        </h3>
        {canEditSettings && (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(setting)}
              className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Edit"
            >
              <FiEdit2 className="text-blue-600" />
            </button>
            <button
              onClick={() => handleDelete(setting._id)}
              className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Delete"
            >
              <FiTrash2 className="text-red-500" />
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
});

export default SettingCard;
