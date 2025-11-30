export type User = {
  id: number;
  firstName: string;
  lastName: string;
  lastMessage: string;
  unread: number;
  online: boolean;
  avatar: string | null;
  lastActive: Date;
};

export type Message = {
  id: number;
  senderId: number;
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file";
  attachment?: string;
};