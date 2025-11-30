import React from "react";

interface ApiErrorProps {
  error?: unknown;
  onRetry?: () => void;
}

const ApiError: React.FC<ApiErrorProps> = ({ error, onRetry }) => {
  // Ensure return type is string
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error) {
      return String((error as Record<string, any>).message);
    }
    return "Something went wrong while fetching data. Please try again.";
  };

  const safeMessage: string = String(getErrorMessage(error));

  return (
    <div className="space-y-4 text-center p-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        Oops! Something went wrong
      </h3>

      {/* ✅ This line no longer errors */}
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {safeMessage}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        This might be a temporary issue. Try again or check your connection.
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ApiError;
