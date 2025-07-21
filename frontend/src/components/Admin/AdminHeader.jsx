export default function AdminHeader({ user }) {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full">
          ADMIN
        </span>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-sm font-medium">{user.name}</span>
            <span className="text-xs text-gray-500">System Administrator</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0)}
          </div>
        </div>
      )}
    </header>
  );
}