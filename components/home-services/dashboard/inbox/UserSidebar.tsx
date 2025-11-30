"use client";
import React from "react";
import { X, Search } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { User } from "@/types/inbox/users";

interface UsersSidebarProps {
  users: User[];
  selectedUser: User | null;
  searchQuery: string;
  /* eslint-disable no-unused-vars */

  setSearchQuery: (query: string) => void;
  onUserSelect: (user: User) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  /* elslint-enable no-unused-vars */
  mobileSidebarOpen: boolean;

}

const UsersSidebar: React.FC<UsersSidebarProps> = ({
  users,
  selectedUser,
  searchQuery,
  setSearchQuery,
  onUserSelect,
  mobileSidebarOpen,
  setMobileSidebarOpen
}) => {
  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700  dark:bg-gray-800 z-30 transition-transform duration-300 flex flex-col ${mobileSidebarOpen ? "fixed inset-0 z-40 md:relative" : "hidden md:flex"
      }`}>
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center dark:bg-gray-800">
        <h2 className="text-base font-semibold">Conversations</h2>
        <button
          className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      {/* Search bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user)}
            className={`flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 ${selectedUser?.id === user.id ? "bg-blue-50 dark:bg-gray-700" : ""
              }`}
          >
            {user.avatar ? (
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <Image src={user.avatar} alt="profile" width={48} height={48} className="w-full h-full object-cover" />
                </div>
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
            ) : (
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white font-medium text-base">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold text-sm truncate">{user.firstName} {user.lastName}</h5>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(user.lastActive)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{user.lastMessage}</p>
                {user.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs min-w-[18px] h-4 flex items-center justify-center rounded-full text-[10px] px-1">
                    {user.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersSidebar;