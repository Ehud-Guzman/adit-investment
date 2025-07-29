// frontend/src/pages/Account/AccountProfile.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FiEdit, FiShield, FiMail, FiPhone, FiUser, FiCheckCircle, FiArrowLeft, FiCamera, FiKey, FiDownload, FiTrash2, FiSettings, FiLock, FiEye, FiEyeOff, FiMoreVertical, FiCopy, FiCalendar, FiMapPin } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AccountProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex justify-center items-center min-h-[50vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-full w-40 mx-auto animate-pulse" />
              <div className="h-3 bg-gray-200 rounded-full w-32 mx-auto animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl text-gray-700 hover:text-blue-600"
          >
            <FiArrowLeft className="text-lg" />
            <span className="font-medium">Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowActions(!showActions)}
            className="p-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl text-gray-700"
          >
            <FiMoreVertical className="text-lg" />
          </motion.button>
        </motion.div>

        {/* Profile Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          {/* Background Card */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Profile Avatar */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                >
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                    <div className="bg-white/90 p-2 rounded-full">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shadow-xl">
                        <FiUser className="text-gray-500 text-4xl md:text-5xl" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Camera Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center"
                  >
                    <FiCamera className="text-white text-xl" />
                  </motion.div>

                  {/* Verification Badge */}
                  {currentUser.isVerified && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg"
                    >
                      <FiCheckCircle className="text-green-500 text-xl" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Profile Info */}
                <div className="text-center md:text-left flex-1">
                  <motion.h1 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold mb-2"
                  >
                    {currentUser.name}
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center md:justify-start gap-2 mb-4 text-white/80"
                  >
                    <FiMail className="text-lg" />
                    <span className="text-lg">{currentUser.email}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(currentUser.email)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <FiCopy className="text-sm" />
                    </motion.button>
                  </motion.div>

                  {/* Status Pills */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentUser.isVerified 
                          ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                          : 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                      }`}
                    >
                      {currentUser.isVerified ? '✓ Verified Account' : '⏳ Pending Verification'}
                    </motion.span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30"
                    >
                       Member
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20"
              >
             
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FiUser className="text-white text-sm" />
              </div>
              Personal Information
            </h2>
          </div>

          <div className="divide-y divide-gray-100/50">
            {/* Name Field */}
            <motion.div 
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.02)" }}
              className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-500 mb-1">Full Name</div>
                <div className="text-gray-900 font-semibold text-lg">{currentUser.name || "Not provided"}</div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => alert("Edit name functionality coming soon")}
              >
                <FiEdit size={14} />
                Edit
              </motion.button>
            </motion.div>

            {/* Email Field */}
            <motion.div 
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.02)" }}
              className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  Email Address
                </div>
                <div className="text-gray-900 font-semibold text-lg mb-2">{currentUser.email}</div>
                <div className="flex gap-2">
                  {currentUser.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium border border-emerald-200">
                      <FiCheckCircle size={12} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium border border-amber-200">
                      ⏳ Unverified
                    </span>
                  )}
                  
                  <AnimatePresence>
                    {copiedEmail && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => alert("Edit email functionality coming soon")}
              >
                <FiEdit size={14} />
                Edit
              </motion.button>
            </motion.div>

            {/* Phone Field */}
            <motion.div 
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.02)" }}
              className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
                  <FiPhone className="text-gray-400" />
                  Phone Number
                </div>
                <div className="text-gray-900 font-semibold text-lg">
                  {currentUser.phone || (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                  currentUser.phone 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                }`}
                onClick={() => alert("Edit phone functionality coming soon")}
              >
                <FiEdit size={14} />
                {currentUser.phone ? "Edit" : "Add Phone"}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Security Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <FiShield className="text-white text-sm" />
              </div>
              Security & Privacy
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Password Section */}
            <motion.div 
              whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.02)" }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <FiKey className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Password</h3>
                  <p className="text-sm text-gray-500">
                    Keep your account secure with a strong password
                  </p>
                  <div className="mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Last updated: 30 days ago
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                onClick={() => alert("Coming soon: Password update flow")}
              >
                <FiLock size={16} />
                Change Password
              </motion.button>
            </motion.div>
            
            {/* 2FA Section */}
            <motion.div 
              whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.02)" }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <FiShield className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                  <div className="mt-2">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                      Not enabled
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => alert("Coming soon: 2FA setup")}
              >
                Enable 2FA
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Account Actions Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-slate-600 rounded-lg flex items-center justify-center">
                <FiSettings className="text-white text-sm" />
              </div>
              Account Management
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
              onClick={() => alert("Coming soon: Data download request")}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                  <FiDownload className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Download Data</h3>
              </div>
              <p className="text-sm text-gray-500">
                Request a copy of all your personal information and activity
              </p>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-6 border-2 border-red-200 rounded-2xl hover:border-red-300 hover:bg-red-50/50 transition-all duration-200 group"
              onClick={() => alert("Coming soon: Account deletion flow")}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl flex items-center justify-center group-hover:from-red-200 group-hover:to-rose-200 transition-colors">
                  <FiTrash2 className="text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Delete Account</h3>
              </div>
              <p className="text-sm text-gray-500">
                Permanently remove your account and all associated data
              </p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountProfile;