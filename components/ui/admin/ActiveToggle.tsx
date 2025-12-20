import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface ActiveToggleProps {
  /* eslint-disable no-unused-vars */
  isActive: boolean;
  onChange: (isActive: boolean) => void;
  label: string;
  id?: string;
  futuristic?: boolean;
  /* eslint-enable no-unused-vars */
}

const ActiveToggle: React.FC<ActiveToggleProps> = ({
  isActive,
  onChange,
  label,
  id = "isActive",
  futuristic = false,
}) => {
  if (futuristic) {
    return (
      <div className="group relative">
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer",
            isActive
              ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border-green-300 dark:border-green-600/50"
              : "bg-gradient-to-r from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 border-red-300 dark:border-red-600/50"
          )}
          onClick={() => onChange(!isActive)}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
                  : "bg-gradient-to-br from-red-500 to-rose-500 shadow-lg shadow-red-500/30"
              )}
            >
              {isActive ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <label
                htmlFor={id}
                className="block text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer"
              >
                {label}
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isActive
                  ? "This item is currently active and visible"
                  : "This item is currently inactive and hidden"}
              </p>
            </div>
          </div>

          {/* Futuristic toggle switch */}
          <div className="relative">
            <div className="w-14 h-8 flex items-center bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full p-1 transition-all duration-300">
              <div
                className={cn(
                  "w-6 h-6 rounded-full bg-white dark:bg-gray-200 shadow-lg transform transition-transform duration-300",
                  isActive ? "translate-x-6" : "translate-x-0"
                )}
              ></div>
            </div>
            <div
              className={cn(
                "absolute -inset-2 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                isActive
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20"
                  : "bg-gradient-to-r from-red-500/20 to-rose-500/20"
              )}
            ></div>
          </div>
        </div>

        {/* Hidden checkbox for accessibility */}
        <input
          type="checkbox"
          id={id}
          checked={isActive}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
      </div>
    );
  }

  // Original version (simplified with theme support)
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={isActive}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={cn(
            "w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500",
            "peer-focus:ring-2 peer-focus:ring-sky-500 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-gray-900"
          )}
          onClick={() => onChange(!isActive)}
        >
          <div
            className={cn(
              "bg-white dark:bg-gray-300 w-4 h-4 rounded-full shadow transform transition-transform duration-300",
              isActive ? "translate-x-6" : "translate-x-0"
            )}
          ></div>
        </div>
      </div>
      <label
        htmlFor={id}
        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
};

export default ActiveToggle;
