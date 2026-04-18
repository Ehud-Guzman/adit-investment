import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiBox,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiArrowLeft,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiUser,
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
    items: [{ label: "Users", value: "users", icon: FiUsers }],
  },
  {
    title: "System",
    superAdminOnly: true,
    items: [{ label: "Settings", value: "settings", icon: FiSettings }],
  },
];

export default function AdminNav({
  currentView = "dashboard",
  setView = () => {},
  onLogout = () => {},
  userName = "Admin",
  userRole = "admin",
  isSuperAdmin = false,
  mobileOpen = false,
  onClose = () => {},
  badgeData = {},
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(
    () => localStorage.getItem("adminSidebarExpanded") !== "false"
  );

  useEffect(() => {
    localStorage.setItem("adminSidebarExpanded", String(isExpanded));
  }, [isExpanded]);

  const handleNavClick = (value) => {
    setView(value);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          lg:static lg:z-auto lg:h-full
          bg-gray-900 text-white
          transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isExpanded ? "w-60" : "w-[72px]"}
        `}
      >
        {/* Brand header */}
        <div
          className={`flex items-center h-14 border-b border-white/10 px-3 flex-shrink-0 ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isExpanded ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-600 p-1.5 rounded-lg flex-shrink-0">
                  <FiHome className="text-white text-sm" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight truncate">
                  Admin Panel
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                title="Collapse sidebar"
              >
                <FiChevronLeft size={15} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <FiHome className="text-white text-sm" />
              </div>
              <button
                onClick={() => setIsExpanded(true)}
                className="hidden lg:flex p-1 rounded text-gray-500 hover:text-white transition-colors"
                title="Expand sidebar"
              >
                <FiChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
          {NAV_SECTIONS.filter((s) => !s.superAdminOnly || isSuperAdmin).map(({ title, items }) => (
            <div key={title}>
              {isExpanded && (
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest px-3 mb-1">
                  {title}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(({ label, value, icon: Icon }) => {
                  const isActive = currentView === value;
                  const badge = badgeData?.[value];
                  return (
                    <button
                      key={value}
                      title={!isExpanded ? label : undefined}
                      onClick={() => handleNavClick(value)}
                      className={`
                        w-full flex items-center rounded-lg transition-all duration-200
                        ${isExpanded ? "gap-3 px-3 py-2.5" : "justify-center p-3"}
                        ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                        }
                      `}
                    >
                      <Icon size={17} className="flex-shrink-0" />
                      {isExpanded && (
                        <>
                          <span className="flex-1 text-sm font-medium text-left truncate">
                            {label}
                          </span>
                          {badge !== undefined && (
                            <span
                              className={`text-xs font-semibold rounded-full px-1.5 py-0.5 ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: back to site + user info + logout */}
        <div className="border-t border-white/10 p-2 space-y-1 flex-shrink-0">
          {/* Back to site */}
          <button
            onClick={() => navigate("/")}
            title={!isExpanded ? "Back to Site" : undefined}
            className={`w-full flex items-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors
              ${isExpanded ? "gap-3 px-3 py-2" : "justify-center p-3"}`}
          >
            <FiArrowLeft size={17} className="flex-shrink-0" />
            {isExpanded && <span className="text-sm font-medium">Back to Site</span>}
          </button>

          {/* User info row */}
          {isExpanded ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <FiUser size={13} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[10px] text-gray-400 capitalize">{userRole}</p>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
              >
                <FiLogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              title="Logout"
              className="w-full flex justify-center p-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <FiLogOut size={17} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
