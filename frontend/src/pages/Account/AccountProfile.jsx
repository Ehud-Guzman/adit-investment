// frontend/src/pages/Account/AccountProfile.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FiEdit, FiShield, FiMail, FiPhone, FiUser, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";

const AccountProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse text-center">
          <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <FiArrowLeft className="text-lg" />
        <span className="font-medium">Back</span>
      </motion.button>

      {/* Profile Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center relative"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded-full">
            <div className="bg-white p-1 rounded-full">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
                <FiUser className="text-gray-400 text-3xl" />
              </div>
            </div>
          </div>
          {currentUser.isVerified && (
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
              <FiCheckCircle className="text-green-500 text-xl" />
            </div>
          )}
        </motion.div>
        
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mt-4"
        >
          {currentUser.name}
        </motion.h1>
        
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mt-2 text-gray-600"
        >
          <FiMail className="text-blue-500" />
          <span>{currentUser.email}</span>
        </motion.div>
      </div>

      {/* Profile Details Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8"
      >
        <div className="border-b border-gray-100">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Personal Information
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Name Field */}
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <span>Full Name</span>
              </div>
              <div className="mt-1 text-gray-900 font-medium">{currentUser.name || "Not provided"}</div>
            </div>
            <button 
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium transition-colors"
              onClick={() => alert("Edit name functionality coming soon")}
            >
              <FiEdit size={16} />
              Edit
            </button>
          </div>

          {/* Email Field */}
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <FiMail className="text-gray-400" />
                <span>Email Address</span>
              </div>
              <div className="mt-1 text-gray-900 font-medium">{currentUser.email}</div>
              <div className="mt-1">
                {currentUser.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    <FiCheckCircle size={12} />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Unverified
                  </span>
                )}
              </div>
            </div>
            <button 
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium transition-colors"
              onClick={() => alert("Edit email functionality coming soon")}
            >
              <FiEdit size={16} />
              Edit
            </button>
          </div>

          {/* Phone Field */}
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <FiPhone className="text-gray-400" />
                <span>Phone Number</span>
              </div>
              <div className="mt-1 text-gray-900 font-medium">
                {currentUser.phone || (
                  <span className="text-gray-400">Not provided</span>
                )}
              </div>
            </div>
            <button 
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium transition-colors"
              onClick={() => alert("Edit phone functionality coming soon")}
            >
              <FiEdit size={16} />
              {currentUser.phone ? "Edit" : "Add"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Security Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8"
      >
        <div className="border-b border-gray-100">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiShield className="text-blue-600" />
              Security
            </h2>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-800">Password</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account password
              </p>
            </div>
            <button
              className="bg-white border border-gray-300 text-blue-600 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
              onClick={() => alert("Coming soon: Password update flow")}
            >
              <FiEdit size={16} />
              Change Password
            </button>
          </div>
          
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-5 py-2.5 rounded-lg font-medium transition-colors"
              onClick={() => alert("Coming soon: 2FA setup")}
            >
              Set up
            </button>
          </div>
        </div>
      </motion.div>

      {/* Account Actions */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8"
      >
        <div className="border-b border-gray-100">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-800">Account Actions</h2>
          </div>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            onClick={() => alert("Coming soon: Data download request")}
          >
            <h3 className="font-medium text-gray-800">Download Personal Data</h3>
            <p className="text-sm text-gray-500 mt-1">
              Request a copy of your personal information
            </p>
          </button>
          
          <button 
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors"
            onClick={() => alert("Coming soon: Account deletion flow")}
          >
            <h3 className="font-medium text-gray-800">Delete Account</h3>
            <p className="text-sm text-gray-500 mt-1">
              Permanently remove your account and data
            </p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountProfile;