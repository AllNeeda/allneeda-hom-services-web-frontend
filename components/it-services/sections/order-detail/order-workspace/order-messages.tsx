'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, MessageSquare, Send, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function OrderMessages() {
  const [newMessage, setNewMessage] = useState("");
  const messages = [
    {
      id: 1,
      sender: "Alex Chen",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      message:
        "Hi Sarah! I've completed the initial logo concepts. I've created 3 different directions based on your requirements. Please take a look and let me know your thoughts!",
      timestamp: "Dec 20, 11:05 AM",
      attachments: [
        { name: "logo-concept-1.png", size: "2.4 MB", type: "image" },
        { name: "logo-concept-2.png", size: "1.8 MB", type: "image" },
        { name: "logo-concept-3.png", size: "2.1 MB", type: "image" },
      ],
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      message:
        "These look amazing! I love concept #2 the most. Could we try a few variations with different color schemes? Also, the font could be slightly bolder.",
      timestamp: "Dec 20, 2:30 PM",
      attachments: [],
    },
    {
      id: 3,
      sender: "Alex Chen",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      message:
        "Perfect! I'll work on those variations. I'm thinking we could try a deep navy, forest green, and maybe a burgundy option. I'll have these ready by tomorrow morning.",
      timestamp: "Dec 20, 3:45 PM",
      attachments: [],
    },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <span>Messages</span>
          <Badge className="ml-auto">{messages.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex gap-3 items-start sm:gap-4"
            >
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <AvatarImage src={message.avatar} />
                <AvatarFallback>
                  {message.sender
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {message.sender}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                    {message.message}
                  </p>
                  {message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                        >
                          <Paperclip className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                          <span className="text-sm text-gray-700 dark:text-gray-200 flex-1 truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {file.size}
                          </span>
                          <Button size="sm" variant="ghost" className="p-1">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              // handle send here
            }}
          >
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px] resize-none flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <div className="flex flex-row sm:flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                aria-label="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}