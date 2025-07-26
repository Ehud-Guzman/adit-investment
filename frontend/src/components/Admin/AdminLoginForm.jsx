import { useState } from "react";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export default function AdminLoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await onLogin(credentials);
      if (!user?.isAdmin) {
        throw new Error("Access denied. Admin privileges required.");
      }
      toast.success(`Super Admin access granted, ${user.name || "Admin"} 👑`);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Super Admin login failed. Please check your credentials.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

   return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-6 sm:p-8 shadow-xl rounded-xl border border-gray-200 mx-4"
    >
      <div className="text-center mb-5">
        <div className="mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4">
          <FiShield className="text-white text-xl sm:text-2xl" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Portal</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Elevated access to e-commerce operations
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-center text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-1 text-sm sm:text-base">Admin Email</label>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="superadmin@example.com"
            className="w-full border border-gray-300 p-2.5 pl-10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 mb-1 text-sm sm:text-base">Security Key</label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full border border-gray-300 p-2.5 pl-10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:shadow-lg hover:from-purple-700 hover:to-indigo-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin h-4 w-4 border-2 border-white border-b-transparent rounded-full mr-2"></span>
              Authenticating...
            </span>
          ) : (
            "Adit-Investment Admin Dashboard"
          )}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <FiShield className="mr-1" />
          Secure access monitored by system admin
        </p>
      </div>
    </form>
  );
}

AdminLoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};