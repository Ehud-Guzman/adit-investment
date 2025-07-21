// src/components/ErrorMessage.jsx
import PropTypes from 'prop-types';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="p-4 bg-red-100 rounded-full mb-4">
        <FiAlertCircle className="text-red-500 text-2xl" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Products</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiRefreshCw />
          Try Again
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func
};

export default ErrorMessage;