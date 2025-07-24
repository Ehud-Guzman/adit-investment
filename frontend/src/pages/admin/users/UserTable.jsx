import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import adminApi from "@/services/api/adminApi"; // 👈 Use the correct Axios instance

import RoleTag from "./RoleTag";
import UserStatusBadge from "./UserStatusBadge";
import UserActions from "./UserActions";
import UserFilters from "./UserFilters";
import UserModal from "./UserModal";

export default function UserTable() {
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

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminUsers", queryFilters],
    queryFn: () =>
      adminApi
        .get("/admin/users", {
          params: queryFilters,
        })
        .then((res) => res.data),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const users = data?.users || [];
  const totalPages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / filters.limit) : 1;
  }, [data, filters.limit]);

  const handlePageChange = (dir) => {
    setFilters((prev) => ({
      ...prev,
      page: prev.page + dir,
    }));
  };

  const openUser = (id) => setSelectedUser(id);
  const closeUser = () => setSelectedUser(null);

  return (
    <div className="p-4 space-y-4">
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs font-semibold text-left text-gray-600 uppercase tracking-wider">
            <tr>
              {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center px-6 py-6 text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="6" className="text-center px-6 py-6 text-red-600">
                  Error: {error?.message}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center px-6 py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => openUser(user._id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleTag role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserStatusBadge status={user.status || "active"} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <UserActions
                      user={user}
                      refetch={refetch}
                      isSuperAdmin={true}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.total > filters.limit && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={filters.page <= 1}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {filters.page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(1)}
            disabled={filters.page >= totalPages}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <UserModal
        isOpen={!!selectedUser}
        userId={selectedUser}
        onRequestClose={closeUser}
      />
    </div>
  );
}
