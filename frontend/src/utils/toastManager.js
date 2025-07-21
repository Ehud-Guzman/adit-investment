import { toast } from "react-toastify";

// This holds all currently active toast IDs
const activeToasts = new Set();

/**
 * Prevents duplicate toasts by ID and shows clean toast notifications.
 * @param {string} id - Unique toast ID
 * @param {string} message - Toast message to show
 * @param {"info" | "success" | "warning" | "error" | "default"} type - Toast type
 * @param {number} duration - Duration in ms
 */
export const safeToast = (id, message, type = "default", duration = 2000) => {
  if (activeToasts.has(id)) return;

  const toastId = toast[type](message, {
    toastId: id,
    autoClose: duration,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    hideProgressBar: true,
    closeOnClick: true,
    draggable: false,
    theme: "colored",
    onClose: () => activeToasts.delete(id),
  });

  activeToasts.add(toastId);
};

/**
 * Clear all active toasts and reset state.
 */
export const clearToasts = () => {
  toast.dismiss();
  activeToasts.clear();
};
