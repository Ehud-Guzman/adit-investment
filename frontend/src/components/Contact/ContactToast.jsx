// components/contact/ContactToast.jsx
import { toast } from "react-toastify";

/**
 * Show a toast for contact form submission status
 * @param {"success" | "error"} status
 * @param {string} [customMessage]
 */
export const showContactToast = (status = "success", customMessage) => {
  const messages = {
    success: customMessage || "Message sent successfully! We'll get back to you soon. ✅",
    error: customMessage || "Failed to send message. Please try again later. ❌",
  };

  toast[status](messages[status], {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light", // You can change to "dark" if your theme prefers it
  });
};
