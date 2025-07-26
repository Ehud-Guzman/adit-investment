export default function AdminHeader({ user }) {
  return (
    <header className="bg-white shadow px-4 py-3 sm:px-6 sm:py-4 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate max-w-[200px] sm:max-w-none">
          Super Admin Dashboard
        </h1>
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
          ADMIN
        </span>
      </div>
      
      {user && (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden xs:block">
            <span className="block text-sm font-medium truncate max-w-[120px] sm:max-w-[160px]">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 hidden sm:block">
              System Administrator
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
            {user.name.charAt(0)}
          </div>
        </div>
      )}
    </header>
  );
}