import React from "react";
import { FiPlus } from "react-icons/fi";

const SettingActions = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition"
        title="Create New Setting"
      >
        <FiPlus size={20} />
      </button>
    </div>
  );
};

export default SettingActions;
