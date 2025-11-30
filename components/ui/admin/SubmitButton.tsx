import React from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  onSubmit,
  label,
}) => (
  <div className="flex justify-end">
    <button
      onClick={onSubmit}
      disabled={isSubmitting}
      className={`relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white rounded transition-colors
        ${
          isSubmitting
            ? "bg-sky-400 cursor-not-allowed"
            : "bg-sky-600 hover:bg-sky-700"
        }
      `}
    >
      {isSubmitting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Posting...
        </>
      ) : (
        label
      )}
    </button>
  </div>
);

export default SubmitButton;
