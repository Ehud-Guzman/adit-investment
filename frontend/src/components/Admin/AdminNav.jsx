import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FiBox,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiArrowLeft,
  FiShoppingCart,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", value: "dashboard", icon: FiBarChart2 }],
  },
  {
    title: "Commerce",
    items: [
      { label: "Products", value: "products", icon: FiBox },
      { label: "Orders", value: "orders", icon: FiShoppingCart },
    ],
  },
  {
    title: "People",
    role: "admin",
    items: [{ label: "Users", value: "users", icon: FiUsers }],
  },
  {
    title: "System",
    role: "admin",
    items: [{ label: "Settings", value: "settings", icon: FiSettings }],
  },
];

export default function AdminNav({
  currentView = "dashboard",
  setView = () => {},
  onLogout = () => {},
  userRole = "admin",
  storeName = "Admin Panel",
  badgeData = {},
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(
    () => localStorage.getItem("adminSidebarExpanded") !== "false"
  );

  useEffect(() => {
    localStorage.setItem("adminSidebarExpanded", isExpanded);
  }, [isExpanded]);

  const isSidebarOpen = isExpanded;

  return (
    <aside
      className={`sticky top-4 h-fit transition-all duration-300 border border-gray-100 rounded-2xl shadow-xl 
        backdrop-blur bg-white/80 dark:bg-gray-900/60
        ${isSidebarOpen ? "sm:w-64" : "sm:w-20"} px-3 sm:px-5 py-6`}
    >
      {/* === Header === */}
      <div className="flex items-center justify-between mb-6">
        {isSidebarOpen ? (
          <div className="flex items-center gap-3 pl-1">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-md">
              <FiHome className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {storeName}
            </h3>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-md mx-auto">
            <FiHome className="text-white text-lg" />
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500"
        >
          <FiChevronRight
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* === Navigation === */}
      <nav className="flex flex-col gap-4 mb-6">
        {NAV_SECTIONS.filter((section) => !section.role || section.role === userRole).map(
          ({ title, items }) => (
            <div key={title} className="space-y-1">
              {isSidebarOpen && (
                <p className="text-xs text-gray-400 font-semibold px-4 uppercase tracking-wider">
                  {title}
                </p>
              )}
              {items.map(({ label, value, icon: Icon }) => {
                const isActive = currentView === value;
                const badge = badgeData?.[value];
                return (
                  <button
                    key={value}
                    title={!isSidebarOpen ? label : ""}
                    onClick={() => setView(value)}
                    className={`group flex items-center w-full text-left transition-all duration-200 
                      ${isSidebarOpen ? "gap-3 px-4" : "justify-center px-0"}
                      py-3 rounded-xl font-medium text-sm
                      ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-colors duration-200 
                        ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-gray-600"
                        }`}
                    >
                      <Icon className="text-base" />
                    </div>

                    {isSidebarOpen && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="truncate">{label}</span>
                        {badge !== undefined && (
                          <span
                            className={`ml-auto text-xs font-semibold rounded-full px-2 py-0.5 
                              ${
                                isActive
                                  ? "bg-white/30 text-white"
                                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100"
                              }`}
                          >
                            {badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="ml-2 w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )
        )}
      </nav>

      {/* === Divider === */}
      <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />

      {/* === Actions === */}
      <div className="space-y-2">
        <button
          onClick={() => navigate("/")}
          className={`group w-full flex items-center 
            ${isSidebarOpen ? "gap-3 px-4" : "justify-center px-0"}
            py-3 rounded-xl text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800 text-sm font-medium`}
        >
          <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 dark:bg-gray-700 dark:group-hover:bg-gray-600">
            <FiArrowLeft className="text-base group-hover:-translate-x-0.5 transition-transform duration-200" />
          </div>
          {isSidebarOpen && <span>Back to Site</span>}
        </button>

        <button
          onClick={onLogout}
          className={`group w-full flex items-center 
            ${isSidebarOpen ? "gap-3 px-4" : "justify-center px-0"}
            py-3 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800 text-sm font-medium`}
        >
          <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 dark:bg-gray-700 dark:group-hover:bg-gray-600">
            <FiLogOut className="text-base" />
          </div>
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
