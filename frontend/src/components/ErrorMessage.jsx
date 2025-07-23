// src/components/ErrorMessage.jsx
import PropTypes from "prop-types";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-10 sm:p-12 text-center rounded-xl bg-white shadow-sm border border-gray-200"
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="p-4 bg-red-100 rounded-full mb-4">
        <FiAlertCircle className="text-red-600 text-3xl sm:text-4xl" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
        Something Went Wrong
      </h3>

      {/* Message */}
      <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-lg">
        {message || "An unexpected error occurred while loading the content."}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiRefreshCw className="text-lg" />
          Try Again
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorMessage;
