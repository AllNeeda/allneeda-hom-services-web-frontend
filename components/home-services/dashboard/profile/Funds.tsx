"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";

interface FundDialog {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreditDialog({ open, setOpen }: FundDialog) {
  const [amount, setAmount] = useState<number | "other">(150);
  const [autoRefill, setAutoRefill] = useState(true);
  const [otherAmount, setOtherAmount] = useState("");

  const handleAddFunds = () => {
    const finalAmount = amount === "other" ? Number(otherAmount) : amount;
    console.log("Adding funds:", finalAmount, "Auto-refill:", autoRefill);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-lg transform overflow-hidden rounded-sm bg-white dark:bg-gray-900 text-left shadow-2xl transition-all duration-300">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-5 py-3">
            <DialogTitle className="font-semibold text-gray-900 dark:text-white text-sm">
              Preload your balance and get extra perks.
            </DialogTitle>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-6">


            {/* Select amount */}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Select an amount to add:
              </p>
              <div className="flex gap-3">
                {[15, 20, 30].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`px-4 py-2 border rounded text-sm ${amount === val
                        ? "bg-[#0077B6] text-white border-[#0077B6]"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300"
                      }`}
                  >
                    Credits {val}
                  </button>
                ))}
                <button
                  onClick={() => setAmount("other")}
                  className={`px-4 py-2 border rounded text-sm ${amount === "other"
                      ? "bg-[#0077B6] text-white border-[#0077B6]"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300"
                    }`}
                >
                  Other
                </button>
              </div>

              {amount === "other" && (
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={otherAmount}
                  onChange={(e) => setOtherAmount(e.target.value)}
                  className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#0077B6] focus:border-transparent outline-none"
                />
              )}
            </div>

            {/* What's included */}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                What is included:
              </p>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-600 mr-1">✓</span> Simplified billing experience
              </div>
              <div className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-600 mr-1">✓</span> 1 Credit ~ 1.5$
              </div>
            </div>

            {/* Auto refill */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Auto-refill</p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={autoRefill}
                  onChange={() => setAutoRefill(!autoRefill)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0077B6] rounded-full peer dark:bg-gray-700 peer-checked:bg-[#0077B6] relative transition-all">
                  <div className="absolute top-0.5 left-[2px] bg-white h-5 w-5 rounded-full transition-all peer-checked:translate-x-full"></div>
                </div>
              </label>
            </div>
            {autoRefill && (
              <p className="text-xs text-gray-500">
                You’ll automatically be charged {amount === "other" ? `$${otherAmount}` : `$${amount}`} each time your balance runs out.
              </p>
            )}

            {/* Order summary */}
            {/* Order summary */}
            <div className="border-t pt-3">
              <p className="font-medium text-sm mb-2">Order summary</p>
              <div className="flex justify-between text-sm">
                <span>Total to be charged</span>
                <span className="font-semibold">
                  {amount === "other"
                    ? `${otherAmount || 0} credits ~ $${((Number(otherAmount) || 0) * 1.5).toFixed(2)}`
                    : `${amount} credits ~ $${(amount * 1.5).toFixed(2)}`}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This balance doesn’t expire and is non-refundable. Its use is subject to Terms of Use.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800 px-5 py-3">
            <button
              onClick={() => setOpen(false)}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFunds}
              className="rounded bg-[#0077B6] px-3 py-2 text-white hover:bg-[#0077B6] text-sm"
            >
              Add funds
            </button>

          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
