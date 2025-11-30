'use client'
import { Message, User } from "@/types/inbox/users";
import { Menu, Send } from "lucide-react";
import React, { useState,  } from "react";
import UsersSidebar from "./UserSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const MessagePage = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const users: User[] = [
    { id: 1, firstName: "Esmatullah", lastName: "Hashimi", lastMessage: "Hello there how are you?", unread: 3, online: true, avatar: null, lastActive: new Date() },
    { id: 2, firstName: "John", lastName: "Doe", lastMessage: "Can we meet tomorrow?", unread: 0, online: false, avatar: null, lastActive: new Date(Date.now() - 86400000) },
    { id: 3, firstName: "Jane", lastName: "Smith", lastMessage: "I sent you the files", unread: 1, online: true, avatar: null, lastActive: new Date() },
    { id: 4, firstName: "Alex", lastName: "Johnson", lastMessage: "Let's catch up soon!", unread: 0, online: true, avatar: null, lastActive: new Date() },
    { id: 5, firstName: "Sarah", lastName: "Williams", lastMessage: "Did you review the proposal?", unread: 5, online: false, avatar: null, lastActive: new Date(Date.now() - 172800000) },
  ];

  // Sample messages data
  const allMessages: Record<number, Message[]> = {
    1: [
      { id: 1, senderId: 1, text: "Hello there how are you?", timestamp: new Date(Date.now() - 3600000), status: "read", type: "text" },
      { id: 2, senderId: 0, text: "I am doing well, thanks for asking!", timestamp: new Date(Date.now() - 3500000), status: "read", type: "text" },
      { id: 3, senderId: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", timestamp: new Date(Date.now() - 3400000), status: "read", type: "text" },
      { id: 4, senderId: 0, text: "That is great to hear! How about we meet tomorrow?", timestamp: new Date(Date.now() - 3300000), status: "read", type: "text" },
      { id: 5, senderId: 1, text: "Sure, that works for me. Let's meet at 3 PM.", timestamp: new Date(Date.now() - 3200000), status: "read", type: "text" },
      { id: 6, senderId: 0, text: "Perfect! I'll see you then.", timestamp: new Date(Date.now() - 3100000), status: "read", type: "text" },
    ],
    2: [
      { id: 1, senderId: 2, text: "Can we meet tomorrow?", timestamp: new Date(Date.now() - 86400000), status: "read", type: "text" },
      { id: 2, senderId: 0, text: "Yes, what time works for you?", timestamp: new Date(Date.now() - 86000000), status: "read", type: "text" },
    ],
    3: [
      { id: 1, senderId: 3, text: "I sent you the files", timestamp: new Date(Date.now() - 172800000), status: "read", type: "text" },
      { id: 2, senderId: 0, text: "Got them, thanks!", timestamp: new Date(Date.now() - 171800000), status: "read", type: "text" },
      { id: 3, senderId: 3, text: "Let me know if you need anything else", timestamp: new Date(Date.now() - 170800000), status: "read", type: "text" },
    ],
    4: [
      { id: 1, senderId: 4, text: "Let's catch up soon!", timestamp: new Date(Date.now() - 259200000), status: "read", type: "text" },
    ],
    5: [
      { id: 1, senderId: 5, text: "Did you review the proposal?", timestamp: new Date(Date.now() - 345600000), status: "read", type: "text" },
      { id: 2, senderId: 5, text: "I need your feedback by tomorrow", timestamp: new Date(Date.now() - 344600000), status: "read", type: "text" },
    ],
    6: [
      { id: 1, senderId: 6, text: "The meeting is scheduled for next week", timestamp: new Date(Date.now() - 432000000), status: "read", type: "text" },
    ],
    7: [
      { id: 1, senderId: 7, text: "Can you send me those documents?", timestamp: new Date(Date.now() - 518400000), status: "read", type: "text" },
    ],
    8: [
      { id: 1, senderId: 8, text: "Thanks for your help with the project", timestamp: new Date(Date.now() - 604800000), status: "read", type: "text" },
    ],
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setMobileSidebarOpen(false);
    setMessages(allMessages[user.id] || []);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      senderId: 0, // 0 represents current user
      text: messageInput,
      timestamp: new Date(),
      status: "sent",
      type: "text"
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    
    // Simulate reply after a short delay
    setTimeout(() => {
      const reply: Message = {
        id: messages.length + 2,
        senderId: selectedUser?.id || 1,
        text: "Thanks for your message!",
        timestamp: new Date(),
        status: "delivered",
        type: "text"
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulate file upload
    const newMessage: Message = {
      id: messages.length + 1,
      senderId: 0,
      text: file.name,
      timestamp: new Date(),
      status: "sent",
      type: "file",
      attachment: URL.createObjectURL(file)
    };
    
    setMessages([...messages, newMessage]);
  };

return (
  <div className="dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col h-screen">
    {/* Mobile header */}
    <div className="flex items-center justify-between md:hidden p-2 border-b border-gray-300 dark:border-gray-700">
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Menu size={20} />
      </button>
      <h1 className="text-lg font-semibold">Messages</h1>
      <div className="w-8" />
    </div>

    {/* Main content */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          mobileSidebarOpen ? "block" : "hidden"
        } md:block w-72 border-r border-gray-300 dark:border-gray-700 overflow-y-auto`}
      >
        <UsersSidebar
          users={users}
          selectedUser={selectedUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onUserSelect={handleUserSelect}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${selectedUser ? "flex" : "hidden md:flex"}`}>
        {selectedUser ? (
          <>
            <ChatHeader selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

            {/* Message list with scroll */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <MessageList messages={messages} selectedUser={selectedUser} />
            </div>

            <MessageInput
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
            />
          </>
        ) : (
          // Empty state when no conversation is selected
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4 text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="text-gray-400" />
            </div>
            <h3 className="font-medium text-lg mb-2">Your messages</h3>
            <p className="text-sm max-w-md">Select a conversation to start chatting or create a new conversation from your contacts.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default MessagePage;