import React from "react";
import SettingItem from "./SettingItem";

const SettingTable = ({ settings = [] }) => {
  return (
    <div className="mt-6 overflow-x-auto border rounded-2xl border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
          <tr>
            <th className="px-4 py-3 text-left">Key</th>
            <th className="px-4 py-3 text-left">Value</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 text-sm">
          {settings.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-zinc-500">
                No settings found.
              </td>
            </tr>
          ) : (
            settings.map((setting) => <SettingItem key={setting._id} setting={setting} />)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SettingTable;
