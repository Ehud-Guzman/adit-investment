import React from 'react';
import { FiSearch } from 'react-icons/fi';

export default function UserFilters({ filters, setFilters }) {
  const roles = ['all', 'user', 'admin', 'superadmin', 'vendor'];
  const statuses = ['all', 'active', 'locked', 'deleted'];

  const handleChange = (key) => (e) => {
    setFilters((f) => ({ ...f, [key]: e.target.value, page: 1 }));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
          <FiSearch className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={handleChange('search')}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Role Filter */}
      <select
        value={filters.role}
        onChange={handleChange('role')}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={handleChange('status')}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
