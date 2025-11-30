"use client";

import React from "react";
import { ReplyItem } from "@/types/reviews/types";


type Props = { replies: ReplyItem[] };

export default function ReviewReplies({ replies }: Props) {
  return (
    <div className="mt-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
      {replies.map(reply => (
        <div key={reply.id} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-500 text-white font-semibold flex items-center justify-center flex-shrink-0">
            {reply.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 dark:text-white">{reply.name}</span>
              {reply.isBusiness && <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 rounded">Business</span>}
              <span className="text-xs text-gray-500">{reply.timeAgo}</span>
            </div>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{reply.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
