// components/admin/users/RoleTag.jsx
import React from 'react';

const roleStyles = {
  user: 'bg-gray-100 text-gray-800',
  admin: 'bg-blue-100 text-blue-800',
  superadmin: 'bg-purple-100 text-purple-800',
  vendor: 'bg-orange-100 text-orange-800',
};

export default function RoleTag({ role }) {
  const styles = roleStyles[role] || roleStyles.user;
  const label = role.split('').shift().toUpperCase() + role.slice(1);
  return (
    <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${styles}`}>
      {label}
    </span>
  );
}
