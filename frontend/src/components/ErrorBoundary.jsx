import { Component } from "react";
import { toast } from "react-toastify";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    toast.error("Something went wrong. Please try again.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 sm:p-6 bg-red-50 rounded-xl text-center">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page or contact support.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Retry loading the page"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;