import React, { useState } from "react";
import {
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import api from "@/services/api/index";
import { toastGuard } from "@/utils/toastControl";

export default function UserActions({ user, refetch, isSuperAdmin }) {
  const [loadingAction, setLoadingAction] = useState(null);

  const handleAction = async (type) => {
    const confirmMsg = {
      promote: "promote this user to admin",
      demote: "demote this admin to user",
      lock:
        user.status === "suspended"
          ? "unlock this user"
          : "lock this user account",
      delete: "soft delete this user",
    };

    if (!window.confirm(`Are you sure you want to ${confirmMsg[type]}?`)) return;
    setLoadingAction(type);

    try {
      const urlMap = {
        lock: `/users/${user._id}/status`,
        promote: `/users/${user._id}/toggle-admin`,
        demote: `/users/${user._id}/toggle-admin`,
        delete: `/users/${user._id}`,
      };

      const bodyMap = {
        lock: {
          status: user.status === "suspended" ? "active" : "suspended",
        },
        promote: { role: "admin" },
        demote: { role: "user" },
        delete: null,
      };

      const method = type === "delete" ? "delete" : "patch";
      const config =
        type === "delete"
          ? {}
          : {
              data: bodyMap[type],
              headers: { "Content-Type": "application/json" },
            };

      await api({ method, url: urlMap[type], ...config });

      toastGuard.once(
        `user-${type}-success-${user._id}`,
        `✅ User ${type}d successfully`,
        "success"
      );

      refetch();
    } catch (err) {
      console.error(err);
      toastGuard.once(
        `user-${type}-fail-${user._id}`,
        err.response?.data?.message || `❌ Failed to ${type} user`,
        "error"
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {isSuperAdmin && (
        <button
          onClick={() =>
            handleAction(user.role === "admin" ? "demote" : "promote")
          }
          disabled={loadingAction === "promote" || loadingAction === "demote"}
          className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-md text-xs disabled:opacity-50 transition"
        >
          {user.role === "admin" ? (
            <>
              <ArrowDownIcon className="w-4 h-4" /> Demote
            </>
          ) : (
            <>
              <ArrowUpIcon className="w-4 h-4" /> Promote
            </>
          )}
        </button>
      )}

      <button
        onClick={() => handleAction("lock")}
        disabled={loadingAction === "lock"}
        className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white rounded-md text-xs disabled:opacity-50 transition"
      >
        {user.status === "suspended" ? (
          <>
            <LockOpenIcon className="w-4 h-4" /> Unlock
          </>
        ) : (
          <>
            <LockClosedIcon className="w-4 h-4" /> Lock
          </>
        )}
      </button>

      <button
        onClick={() => handleAction("delete")}
        disabled={loadingAction === "delete"}
        className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-md text-xs disabled:opacity-50 transition"
      >
        <TrashIcon className="w-4 h-4" /> Delete
      </button>
    </div>
  );
}
