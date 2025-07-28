// frontend/src/pages/Account/Account.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Account = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="md:w-1/4 border-r bg-gray-50 p-4">
            <h2 className="text-lg font-semibold mb-4">My Account</h2>
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  `p-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
                  }`
                }
              >
                Profile
              </NavLink>
              <NavLink
                to="orders"
                className={({ isActive }) =>
                  `p-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
                  }`
                }
              >
                Orders
              </NavLink>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
