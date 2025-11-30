"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  /* eslint-disable no-unused-vars */
  onSubmit: (text: string) => void;
  /* eslint-enable no-unused-vars */
  onCancel: () => void;
};

export default function ReplyForm({ onSubmit, onCancel }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) onSubmit(text);
  };

  return (
    <div className="w-full mt-2 space-y-2">
      <textarea
        placeholder="Write your reply..."
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full min-h-[100px] p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleSubmit} size="sm">Submit Reply</Button>
        <Button variant="outline" onClick={onCancel} size="sm">Cancel</Button>
      </div>
    </div>
  );
}
