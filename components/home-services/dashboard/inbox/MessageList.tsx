"use client";
import React, { useEffect, useRef } from "react";
import { FileText, Download } from "lucide-react";
import Image from "next/image";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { Message, User } from "@/types/inbox/users";

interface MessageListProps {
  messages: Message[];
  selectedUser: User;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedUser
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM d, yyyy");
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-4 flex flex-col gap-4">
        {messages.length > 0 && (
          <div className="text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {formatDate(messages[0].timestamp)}
            </span>
          </div>
        )}
        
        {messages.map((message, index) => {
          const showAvatar = message.senderId !== 0 && 
            (index === 0 || messages[index - 1].senderId !== message.senderId);
          
          const showDate = index === 0 || 
            formatDate(messages[index].timestamp) !== formatDate(messages[index - 1].timestamp);
          
          return (
            <div key={message.id}>
              {showDate && index !== 0 && (
                <div className="text-center my-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              {message.senderId === 0 ? (
                // Sent messages (current user)
                <div className="flex justify-end mb-2">
                  <div className="bg-[#0077b6] text-white rounded-2xl rounded-tr-none py-2 px-4 max-w-xs md:max-w-md">
                    {message.type === "text" ? (
                      <p className="text-sm">{message.text}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span className="text-sm truncate">{message.text}</span>
                        <Download size={14} className="flex-shrink-0 cursor-pointer" />
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span className="text-[10px] text-blue-100">{formatTime(message.timestamp)}</span>
                      {message.status === "sent" && (
                        <span className="w-3 h-3 rounded-full bg-blue-200"></span>
                      )}
                      {message.status === "delivered" && (
                        <span className="text-[10px] text-blue-100">✓✓</span>
                      )}
                      {message.status === "read" && (
                        <span className="text-[10px] text-blue-100">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Received messages
                <div className="flex items-start gap-2 mb-2">
                  {showAvatar && (
                    <div className="relative flex-shrink-0">
                      {selectedUser.avatar ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                          <Image src={selectedUser.avatar} alt="profile" width={32} height={32} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white font-medium text-xs">
                          {selectedUser.firstName.charAt(0)}
                          {selectedUser.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!showAvatar && <div className="w-8" />}
                  
                  <div className=" dark:bg-gray-800 rounded-2xl rounded-tl-none py-2 px-4 max-w-xs md:max-w-md shadow-sm">
                    {message.type === "text" ? (
                      <p className="text-sm">{message.text}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span className="text-sm truncate">{message.text}</span>
                        <Download size={14} className="flex-shrink-0 cursor-pointer" />
                      </div>
                    )}
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 text-right mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;