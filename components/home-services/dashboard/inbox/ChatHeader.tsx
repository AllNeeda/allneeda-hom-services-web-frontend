"use client";
import React from "react";
import { ArrowLeft, Video, Mic, MoreVertical } from "lucide-react";
import Image from "next/image";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { User } from "@/types/inbox/users";


interface ChatHeaderProps {
  selectedUser: User;
   /* eslint-disable no-unused-vars */
  setSelectedUser: (user: null) => void;
    /* elslint-enable no-unused-vars */
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  setSelectedUser
}) => {
  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-1 mr-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setSelectedUser(null)}>
          <ArrowLeft size={18} />
        </button>
        <div className="relative flex-shrink-0">
          {selectedUser.avatar ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
              <Image src={selectedUser.avatar} alt="profile" width={40} height={40} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
              {selectedUser.firstName.charAt(0)}
              {selectedUser.lastName.charAt(0)}
            </div>
          )}
          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${selectedUser.online ? "bg-green-500" : "bg-gray-400"}`}></div>
        </div>
        <div>
          <h5 className="font-semibold text-sm">{selectedUser.firstName} {selectedUser.lastName}</h5>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedUser.online ? "Online" : `Last seen ${formatDate(selectedUser.lastActive)} at ${formatTime(selectedUser.lastActive)}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Video size={18} />
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Mic size={18} />
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;