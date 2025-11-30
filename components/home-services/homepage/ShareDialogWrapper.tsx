// components/share/ShareDialogWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { Share2 } from "lucide-react";
import type { ComponentType } from "react";

const ShareDialog = dynamic(
  () => import("./ShareDialog").then((mod) => mod.ShareProfileDialog as ComponentType<{}>),
  { 
    ssr: false,
    loading: () => (
      <button 
        className="mt-3 z-99 sm:mt-4 border border-gray-200 dark:border-gray-800 w-full sm:w-fit px-5 py-2 flex items-center justify-center sm:justify-start gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <p>Share</p>
      </button>
    )
  }
) as ComponentType<{}>;

export default function ShareDialogWrapper() {
  return <ShareDialog />;
}