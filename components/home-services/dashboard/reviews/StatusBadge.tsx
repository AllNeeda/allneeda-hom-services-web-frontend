"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";
import { ReviewStatus } from "@/types/reviews/types";

const statusIcons = {
    Approved: <CheckCircle className="w-4 h-4" />,
    Pending: <Clock className="w-4 h-4" />,
    Declined: <XCircle className="w-4 h-4" />,
};

const statusColors = {
    Approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800",
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    Declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800",
};

export function StatusBadge({ status }: { status: ReviewStatus }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${statusColors[status]}`}>
            {statusIcons[status]} {status}
        </span>
    );
}
