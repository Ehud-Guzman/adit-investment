// src/components/Admin/AdminLayout.jsx
import { FiLogOut, FiUser, FiShield } from "react-icons/fi";

export default function AdminLayout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-2 sm:p-4">
      <div className="w-full max-w-screen-xl flex-1 flex flex-col shadow-lg bg-white rounded-xl overflow-hidden">
        {/* 🔰 Header */}
        <header className="bg-white border-b px-4 py-3 sm:px-6 sm:py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <FiShield className="text-indigo-600 text-xl sm:text-2xl" />
            <h1 className="text-xl sm:text-2xl font-semibold text-indigo-700 truncate max-w-[160px] sm:max-w-none">
              Adit-Investment Admin
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
              v2.5.1
            </span>
          </div>

          {user && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm">
                <FiUser className="text-indigo-500" />
                <span className="font-medium truncate max-w-[80px] sm:max-w-[120px]">
                  {user.name}
                </span>
                <span className="hidden sm:inline text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-tr from-red-500 to-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 text-sm sm:text-base"
              >
                <FiLogOut className="text-sm sm:text-base" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </header>

        {/* 🧱 Main Content */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>

        {/* ⚙️ Footer */}
        <footer className="text-center text-xs sm:text-sm text-gray-500 p-3 sm:p-4 border-t bg-white">
          © {new Date().getFullYear()} Adit-Investment Admin Panel •{" "}
          <span className="text-green-600 font-medium">System Operational</span>
        </footer>
      </div>
    </div>
  );
}
