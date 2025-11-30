"use client";
import React, { useRef } from "react";
import { Paperclip, Camera, Send } from "lucide-react";

interface MessageInputProps {
  messageInput: string;
  onSendMessage: () => void;
   /* eslint-disable no-unused-vars */
  setMessageInput: (input: string) => void;

  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /* elslint-enable no-unused-vars */
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  setMessageInput,
  onSendMessage,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={18} />
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={onFileUpload}
        />
        
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Camera size={18} />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-full py-2.5 pl-4 pr-10 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        
        <button 
          className="p-2.5 bg-[#0077b6] text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSendMessage}
          disabled={messageInput.trim() === ""}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;