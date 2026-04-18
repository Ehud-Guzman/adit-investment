// src/components/Admin/AdminLayout.jsx
// Thin shell — header/nav/logout are all handled inside Admin.jsx + AdminNav.jsx
export default function AdminLayout({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {children}
    </div>
  );
}
