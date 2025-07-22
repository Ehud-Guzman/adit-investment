// 📦 src/utils/toastControl.js
import { toast } from "react-toastify";

// Track which toast IDs have been shown
const shownToasts = new Set();

/**
 * 🔐 Show a toast only once per unique ID
 * @param {string} id - Unique identifier (not the internal toastId)
 * @param {string} message - Message to display
 * @param {"info" | "success" | "warning" | "error" | "default"} type
 * @param {number} duration - in milliseconds
 */
export const safeToast = (id, message, type = "default", duration = 3000) => {
  if (shownToasts.has(id)) return;

  shownToasts.add(id);

  toast[type](message, {
    toastId: id,
    autoClose: duration,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    hideProgressBar: true,
    closeOnClick: true,
    draggable: false,
    theme: "colored",
    onClose: () => shownToasts.delete(id), // 🔁 allow retry later
  });
};

/**
 * 💣 Force a toast regardless of ID
 * @param {string} message
 * @param {"info" | "success" | "warning" | "error" | "default"} type
 * @param {number} duration
 */
export const forceToast = (message, type = "default", duration = 3000) => {
  toast[type](message, {
    autoClose: duration,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    hideProgressBar: true,
    closeOnClick: true,
    draggable: false,
    theme: "colored",
  });
};

/**
 * 🧼 Clear all toasts and reset state
 */
export const clearToasts = () => {
  toast.dismiss();
  shownToasts.clear();
};

/**
 * 🔁 Reset a specific toast lock
 * @param {string} id
 */
export const resetToastLock = (id) => {
  shownToasts.delete(id);
};

/**
 * ✅ Check if a toast is currently locked
 * @param {string} id
 * @returns {boolean}
 */
export const isToastLocked = (id) => shownToasts.has(id);

// 🔄 Aliases
export const toastGuard = {
  once: safeToast,
  force: forceToast,
  reset: clearToasts,
  clear: resetToastLock,
  isLocked: isToastLocked,
};
