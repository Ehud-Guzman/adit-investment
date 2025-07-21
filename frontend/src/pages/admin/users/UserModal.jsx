// components/admin/users/UserModal.jsx
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import RoleTag from './RoleTag';
import UserStatusBadge from './UserStatusBadge';

Modal.setAppElement('#root');

export default function UserModal({ isOpen, onRequestClose, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;
    setLoading(true);
    axios
      .get(`/api/admin/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("❌ Modal fetch error:", err))
      .finally(() => setLoading(false));
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-xl max-w-lg w-full mx-auto p-6 mt-24 shadow-2xl border border-gray-200"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50"
    >
      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">Loading user details...</div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p className="flex items-center gap-1"><span className="font-medium">Role:</span> <RoleTag role={user.role} /></p>
            <p className="flex items-center gap-1"><span className="font-medium">Status:</span> <UserStatusBadge status={user.status} /></p>
            <p><span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={onRequestClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 font-medium border"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
