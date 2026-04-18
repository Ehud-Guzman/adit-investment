import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import adminApi from "@/services/api/adminApi";

import RoleTag from "./RoleTag";
import UserStatusBadge from "./UserStatusBadge";
import UserActions from "./UserActions";
import UserFilters from "./UserFilters";
import UserModal from "./UserModal";

export default function UserTable({ isSuperAdmin = false }) {
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
    page: 1,
    limit: 10,
  });

  const [selectedUser, setSelectedUser] = useState(null);

  const queryFilters = useMemo(() => {
    const clean = {};
    if (filters.search?.trim()) clean.search = filters.search.trim();
    if (filters.role !== "all") clean.role = filters.role;
    if (filters.status !== "all") clean.status = filters.status;
    clean.page = filters.page;
    clean.limit = filters.limit;
    return clean;
  }, [filters]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["adminUsers", queryFilters],
    queryFn: () =>
      adminApi
        .get("/admin/users", { params: queryFilters })
        .then((res) => res.data),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const users = data?.users || [];
  const totalPages = useMemo(
    () => (data?.total ? Math.ceil(data.total / filters.limit) : 1),
    [data, filters.limit]
  );

  const handlePageChange = (dir) =>
    setFilters((prev) => ({ ...prev, page: prev.page + dir }));

  return (
    <div className="space-y-4">
      {/* Filters — owned by this component */}
      <UserFilters filters={filters} setFilters={setFilters} />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-red-500 text-sm">
                  {error?.message || "Failed to load users."}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                  No users match your filters.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedUser(user._id)}
                >
                  <td className="px-5 py-3.5 whitespace-nowrap font-medium text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <RoleTag role={user.role} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <UserStatusBadge status={user.status || "active"} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="px-5 py-3.5 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <UserActions user={user} refetch={refetch} isSuperAdmin={isSuperAdmin} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-500">
            Page {filters.page} of {totalPages}
            {data?.total ? ` · ${data.total} users` : ""}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={filters.page <= 1}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(1)}
              disabled={filters.page >= totalPages}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User detail modal */}
      <UserModal
        isOpen={!!selectedUser}
        userId={selectedUser}
        onRequestClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
