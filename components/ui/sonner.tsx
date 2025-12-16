"use client";

import { Toaster as Sonner } from "sonner";

export const Toaster = () => {
  return (
    <Sonner
      position="top-right"
      richColors
      toastOptions={{
        style: {
          background: "transparent",
        },
        classNames: {
          toast: "rounded-xl shadow-lg border text-sm font-medium px-4 py-3",

          success: "!bg-emerald-900 !text-white !border-emerald-700",
          error: "!bg-rose-900 !text-white !border-rose-700",
          info: "!bg-sky-900 !text-white !border-sky-700",
          warning: "!bg-amber-900 !text-black !border-amber-600",

          icon: "!text-white", // 🔥 THIS FIXES IT
        },
      }}
    />
  );
};

/*
Example of usage:
toast.success("Quotation Sent Successfully", {
        description: "Your quotation has been sent successfully.",
        icon: <Sparkles />, OPTIONAL
      });

      */
