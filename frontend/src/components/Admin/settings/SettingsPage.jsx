// src/components/Admin/settings/SettingsPage.jsx

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiPlus } from "react-icons/fi";
import { getSettings } from "@/services/api/settingsApi";

import SettingModal from "./SettingModal";
import SettingCard from "./SettingCard";
import SettingTable from "./SettingsTable";
import { safeToast } from "@/utils/toastManager";

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [viewMode, setViewMode] = useState("cards");

  const {
  data = {},
  isLoading,
  isError,
  error,
  refetch,
} = useQuery({
  queryKey: ["settings"],
  queryFn: getSettings,
  staleTime: 1000 * 60 * 5,
  onError: (err) => {
    const message = err?.response?.data?.message || "Failed to fetch settings.";
    safeToast.error(message);
  },
});

const settings = data.settings || [];


  const handleCreate = () => {
    setEditingSetting(null);
    setIsModalOpen(true);
  };

  const handleEdit = (setting) => {
    setEditingSetting(setting);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSetting(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 🔖 Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          ⚙️ Settings & Integrations
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setViewMode((prev) => (prev === "cards" ? "table" : "cards"))
            }
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded transition"
          >
            Switch to {viewMode === "cards" ? "Table View" : "Card View"}
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
          >
            <FiPlus className="text-lg" />
            New Setting
          </button>
        </div>
      </div>

      {/* 📦 State Handling */}
      {isLoading && (
        <div className="text-sm text-gray-500 animate-pulse">
          ⏳ Loading settings...
        </div>
      )}

      {isError && (
        <div className="text-sm text-red-500">
          ⚠️ Something went wrong while fetching settings.
        </div>
      )}

      {/* 🗂️ Settings View */}
      {!isLoading && !isError && (
        <>
          {settings.length === 0 ? (
            <p className="text-gray-500">
              No settings available. Use the button above to add one.
            </p>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.map((setting) => (
                <SettingCard
                  key={setting._id}
                  setting={setting}
                  onEdit={() => handleEdit(setting)}
                  refetch={refetch}
                />
              ))}
            </div>
          ) : (
            <SettingTable
              settings={settings}
              onEdit={handleEdit}
              refetch={refetch}
            />
          )}
        </>
      )}

      {/* 🧩 Modal */}
      {isModalOpen && (
        <SettingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          setting={editingSetting}
          refetch={refetch}
        />
      )}
    </div>
  );
}
