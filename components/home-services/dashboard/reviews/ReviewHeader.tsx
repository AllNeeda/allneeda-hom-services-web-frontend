"use client";

import React from "react";
import { CheckCircle, Clock, XCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewItem, ReviewStatus } from "@/types/reviews/types";

type Props = {
  review: ReviewItem;
  /* eslint-disable no-unused-vars */
  updateStatus: (status: ReviewStatus) => void;
  /* eslint-enable no-unused-vars */
};

export default function ReviewHeader({ review, updateStatus }: Props) {
  const statusIcons = {
    Approved: <CheckCircle className="w-4 h-4" />,
    Pending: <Clock className="w-4 h-4" />,
    Declined: <XCircle className="w-4 h-4" />
  };

  const statusColors = {
    Approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800",
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    Declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between  items-start p-4 gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-[#0077B6] text-white font-semibold flex items-center justify-center flex-shrink-0">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">{review.name}</h4>
          <p className="text-sm text-gray-500 truncate">{review.timeAgo}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${statusColors[review.status]}`}>
          {statusIcons[review.status]} {review.status}
        </span>
        <div className="relative group">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
            <button onClick={() => updateStatus("Approved")} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
              <CheckCircle className="w-4 h-4" /> Approved
            </button>
            <button onClick={() => updateStatus("Pending")} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
              <Clock className="w-4 h-4" /> Pending
            </button>
            <button onClick={() => updateStatus("Declined")} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
              <XCircle className="w-4 h-4" /> Declined
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
