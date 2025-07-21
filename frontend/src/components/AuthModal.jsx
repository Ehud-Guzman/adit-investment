import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import AuthSection from "./AuthSection";



const AuthModal = ({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
  login,
  register,
  isLoggingIn,
  isRegistering,
  
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isLogin = authMode === "login";

  const toggleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = (e) => {
    e.preventDefault();
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSafeClose = () => {
    try {
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.warn("⚠️ Modal close error:", err.message);
    }
  };

 


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[500]"
            onClick={handleSafeClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-[1000] mx-auto w-full max-w-md px-4"
          >
            <div className="bg-white rounded-xl shadow-2xl relative overflow-hidden">
              {/* Close Button */}
              <button
                type="button"
                onClick={handleSafeClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>

     <AuthSection
  authMode={authMode}
  setAuthMode={setAuthMode}
  login={login}
  register={register}
  isLoggingIn={isLoggingIn}
  isRegistering={isRegistering}
  onClose={handleSafeClose}
  isOpen={isOpen} // ✅ THIS LINE FIXES THE ERROR
  passwordFieldType={showPassword ? "text" : "password"}
  confirmPasswordFieldType={showConfirmPassword ? "text" : "password"}
  passwordIcon={
    <button
      type="button"
      onMouseDown={toggleShowPassword}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
    </button>
  }
  confirmPasswordIcon={
    !isLogin && (
      <button
        type="button"
        onMouseDown={toggleShowConfirmPassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label={
          showConfirmPassword
            ? "Hide confirm password"
            : "Show confirm password"
        }
      >
        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    )
  }
/>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
