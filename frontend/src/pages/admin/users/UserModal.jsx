import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/services/api/index';
import RoleTag from './RoleTag';
import UserStatusBadge from './UserStatusBadge';
import { X, Mail, UserCircle, Calendar, Shield } from 'lucide-react';

Modal.setAppElement('#root');

export default function UserModal({ isOpen, onRequestClose, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/admin/users/${userId}`);
        setUser(data);
      } catch (err) {
        console.error("❌ Modal fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isOpen, userId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          className="outline-none"
          overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            {/* Floating Close Button */}
            <button
              onClick={onRequestClose}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </button>

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xl font-semibold shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user?.name}</h2>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">User ID: {user?.id}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm text-gray-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <RoleTag role={user?.role} />
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-blue-500" />
                    <UserStatusBadge status={user?.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Joined: {new Date(user?.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 text-right">
                  <button
                    onClick={onRequestClose}
                    className="px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-800 dark:hover:bg-indigo-700 text-sm font-medium text-indigo-800 dark:text-white transition"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
