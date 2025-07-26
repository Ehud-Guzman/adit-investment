import { 
  FiBox, FiLogOut, FiHome, FiSettings, 
  FiUsers, FiShoppingCart, FiBarChart2, FiDatabase, FiShield 
} from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FiHome /> },
    { path: '/admin/users', label: 'User Management', icon: <FiUsers /> },
    { path: '/admin/products', label: 'Products', icon: <FiBox /> },
    { path: '/admin/orders', label: 'Order Management', icon: <FiShoppingCart /> },
    { path: '/admin/analytics', label: 'Business Analytics', icon: <FiBarChart2 /> },
    { path: '/admin/integrations', label: 'Integrations', icon: <FiDatabase /> },
    { path: '/admin/settings', label: 'System Settings', icon: <FiSettings /> },
  ];

 return (
    <aside className="w-56 sm:w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-6 flex flex-col h-full">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <FiShield className="text-indigo-300 text-xl sm:text-2xl" />
          <h2 className="text-lg sm:text-xl font-bold">Admin</h2>
        </div>
        <p className="text-indigo-200 text-xs">
          E-Commerce Control Center
        </p>
      </div>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive 
                  ? 'bg-indigo-600 text-white font-medium shadow' 
                  : 'text-indigo-100 hover:bg-gray-700'
              }`
            }
          >
            <span className="text-base sm:text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-red-300 hover:bg-gray-700 rounded-lg mt-auto text-sm sm:text-base"
      >
        <FiLogOut className="text-base sm:text-lg" />
        Logout
      </button>
    </aside>
  );
}