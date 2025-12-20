"use client";

import { toast } from "sonner";
import { ReactNode } from "react";
import { AlertTriangle, CheckCircle, Info, Trash2 } from "lucide-react";

export interface ConfirmationOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  variant?: "destructive" | "warning" | "info" | "success";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

const getVariantStyles = (variant: ConfirmationOptions["variant"]) => {
  switch (variant) {
    case "destructive":
      return {
        borderColor: "border-red-200",
        icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
        confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
        iconBgClass: "bg-red-100",
      };
    case "warning":
      return {
        borderColor: "border-amber-200",
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        confirmButtonClass: "bg-amber-600 hover:bg-amber-700 text-white",
        iconBgClass: "bg-amber-100",
      };
    case "success":
      return {
        borderColor: "border-green-200",
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        confirmButtonClass: "bg-green-600 hover:bg-green-700 text-white",
        iconBgClass: "bg-green-100",
      };
    case "info":
    default:
      return {
        borderColor: "border-blue-200",
        icon: <Info className="w-5 h-5 text-blue-600" />,
        confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
        iconBgClass: "bg-blue-100",
      };
  }
};

export const showConfirmation = (options: ConfirmationOptions) => {
  const {
    title = "Are you sure?",
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon,
    variant = "destructive",
    onConfirm,
    onCancel,
  } = options;

  const variantStyles = getVariantStyles(variant);

  toast.custom(
    (t) => (
      <div
        className={`w-full max-w-md rounded-lg bg-white p-4 shadow-lg border ${variantStyles.borderColor} animate-in slide-in-from-bottom-5 duration-300`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`${variantStyles.iconBgClass} p-2 rounded-full flex-shrink-0`}
          >
            {icon || variantStyles.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{description}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  toast.dismiss(t);
                  onCancel?.();
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  try {
                    await onConfirm();
                  } catch (error) {
                    console.error("Error in confirmation onConfirm:", error);
                  }
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${variantStyles.confirmButtonClass}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity, // Don't auto-dismiss
      position: "top-center",
    }
  );
};

// Convenience functions for common use cases
export const confirmDelete = (
  description: string,
  onConfirm: () => void | Promise<void>,
  itemName?: string
) => {
  showConfirmation({
    title: itemName ? `Delete ${itemName} ?` : "Delete Item?",
    description,
    confirmText: "Delete",
    icon: <Trash2 className="w-5 h-5" />,
    variant: "destructive",
    onConfirm,
  });
};

export const confirmWarning = (
  title: string,
  description: string,
  onConfirm: () => void | Promise<void>
) => {
  showConfirmation({
    title,
    description,
    confirmText: "Proceed",
    variant: "warning",
    onConfirm,
  });
};

export const confirmSuccess = (
  title: string,
  description: string,
  onConfirm: () => void | Promise<void>
) => {
  showConfirmation({
    title,
    description,
    confirmText: "Continue",
    variant: "success",
    onConfirm,
  });
};
