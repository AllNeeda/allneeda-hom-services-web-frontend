"use client";

import React from "react";
import { ThumbsUp } from "lucide-react";

type Props = {
  helpful: boolean;
  toggleHelpful: () => void;
  count: number;
};

export default function HelpfulButton({ helpful, toggleHelpful, count }: Props) {
  return (
    <button
      onClick={toggleHelpful}
      className={`flex items-center gap-1 text-sm ${helpful ? 'text-[#0077B6] dark:text-blue-400 font-medium' : 'text-gray-500'}`}
    >
      <ThumbsUp className="w-4 h-4" />
      Helpful {helpful && '✓'} ({count})
    </button>
  );
}
