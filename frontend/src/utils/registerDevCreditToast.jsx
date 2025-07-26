import { toast } from "react-toastify";
import { FiX, FiCopy, FiExternalLink, FiStar } from "react-icons/fi";

/**
 * 💎 Registers the premium dev credit toast shortcut (Ctrl + G)
 * Call this ONCE from any entry point like App or main
 */
export const registerDevCreditShortcut = () => {
  if (typeof window === "undefined") return;

  const TOAST_ID = "glimmer-dev-toast";

  const handler = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "g") {
      if (toast.isActive(TOAST_ID)) {
        toast.dismiss(TOAST_ID);
        return;
      }

      const content = (
        <div className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-5 rounded-xl border border-blue-200 shadow-xl max-w-md w-[calc(100vw-2rem)] sm:w-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
            <div className="flex items-center min-w-0">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 sm:p-2 rounded-md flex items-center justify-center">
                  <FiStar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 flex flex-wrap items-baseline gap-1">
                  <span className="truncate">Glimmerink Creations</span>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full whitespace-nowrap">
                    Premium Partner
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Enterprise-Grade Digital Solutions
                </p>
              </div>
            </div>

            <button
              onClick={() => toast.dismiss(TOAST_ID)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
            >
              <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
            {/* Location Card */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 flex items-center text-sm sm:text-base">
                <span className="bg-blue-100 text-blue-800 p-1 rounded mr-1.5">📍</span>
                Location
              </h4>
              <p className="text-gray-700 text-sm sm:text-base">Busia, Kenya</p>
            </div>

            {/* Contact Card */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 flex items-center text-sm sm:text-base">
                <span className="bg-blue-100 text-blue-800 p-1 rounded mr-1.5">📞</span>
                Contact
              </h4>
              <div className="flex items-center justify-between min-w-0">
                <div className="min-w-0 overflow-hidden">
                  <p className="text-gray-700 truncate text-sm sm:text-base">+254 746 527 253</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("+254746527253");
                    toast.success("Copied to clipboard!", { autoClose: 2000 });
                  }}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded-full transition-colors hover:bg-blue-100 flex-shrink-0 ml-2"
                  title="Copy number"
                >
                  <FiCopy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
              <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2">🌐</span>
              Online Presence
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-gray-700 text-sm sm:text-base">Portfolio:</span>
                <a
                  href="https://glimmerink.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base group"
                >
                  Visit 
                  <FiExternalLink className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-gray-700 text-sm sm:text-base">Email:</span>
                <a
                  href="mailto:nyamuehud@gmail.com"
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base group"
                >
                  Contact 
                  <FiExternalLink className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Featured Projects */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Featured Projects</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-2 py-1 rounded-lg text-xs sm:text-sm border border-blue-200 truncate max-w-[120px]">
                ADIT Investment
              </span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-2 py-1 rounded-lg text-xs sm:text-sm border border-blue-200 truncate max-w-[120px]">
                Vittorioustrade
              </span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-2 py-1 rounded-lg text-xs sm:text-sm border border-blue-200 truncate max-w-[120px]">
                E-commerce Solutions
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 text-center text-xs text-gray-500 flex flex-col items-center">
            <div className="bg-gray-100 px-2 py-1 rounded-lg text-gray-600 inline-flex items-center">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">Ctrl</kbd>
              <span className="mr-1">+</span>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">G</kbd>
              <span className="mx-2">to toggle</span>
            </div>
          </div>
        </div>
      );

      toast.info(content, {
        toastId: TOAST_ID,
        position: "bottom-left",
        autoClose: 15000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        className: "!p-0 !bg-transparent !max-w-full",
        bodyClassName: "!p-0",
        icon: false,
      });
    }
  };

  if (!window.__glimmer_toast_registered) {
    document.addEventListener("keydown", handler);
    window.__glimmer_toast_registered = true;
  }
};