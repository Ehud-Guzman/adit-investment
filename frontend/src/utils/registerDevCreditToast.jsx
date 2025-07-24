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
        <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl border border-blue-200 shadow-xl max-w-md">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-md">
                  <FiStar className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  Glimmerink Creations
                  <span className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                    Premium Partner
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enterprise-Grade Digital Solutions
                </p>
              </div>
            </div>

            <button
              onClick={() => toast.dismiss(TOAST_ID)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2">📍</span>
                Location
              </h4>
              <p className="text-gray-700">Busia, Kenya</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2">📞</span>
                Contact
              </h4>
              <div className="flex justify-between items-center">
                <p className="text-gray-700">+254 746 527 253</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("+254746527253");
                    toast.success("Copied to clipboard!", { autoClose: 2000 });
                  }}
                  className="text-blue-600 hover:text-blue-800 ml-2"
                  title="Copy number"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2">🌐</span>
              Online Presence
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-gray-700">Portfolio:</span>
                <a
                  href="https://glimmerink.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Visit <FiExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>

              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-gray-700">Email:</span>
                <a
                  href="mailto:nyamuehud@gmail.com"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Contact <FiExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Featured Projects */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Featured Projects</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm border border-blue-200">
                ADIT Investment
              </span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm border border-blue-200">
                Vittorioustrade
              </span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm border border-blue-200">
                E-commerce Solutions
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Press <strong>Ctrl + G</strong> again to close
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
        icon: false,
      });
    }
  };

  if (!window.__glimmer_toast_registered) {
    document.addEventListener("keydown", handler);
    window.__glimmer_toast_registered = true;
  }
};
