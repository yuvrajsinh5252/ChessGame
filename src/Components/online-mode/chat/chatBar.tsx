import { Button } from "@/Components/ui/button";
import { sendMessage } from "@/lib/db/chat/chat-server";
import { pusherClient } from "@/lib/pusher";
import useChatStore from "@/store/useChatStore";
import { Input } from "postcss";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";
import { ChatMessage } from "./message";
import { MessageSquare, MessageCircle, Send } from "lucide-react";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const ChatSidebar = ({
  playerId,
  roomId,
}: {
  playerId: string;
  roomId: string;
}) => {
  const [message, setMessage] = useState("");
  const chatStore = useStore(useChatStore, (state) => state);
  const [messageSeen, setMessageSeen] = useState([0, 0]);

  const {
    messages,
    addMessage,
    setRoomId,
    roomId: chatRoomid,
  } = chatStore! || {
    messages: [],
    setRoomId() {},
    addMessage: () => {},
  };

  useEffect(() => {
    const channel = pusherClient.subscribe(`${roomId}`);
    channel.bind("chat", (data: { message: string; playerId: string }) => {
      const newMessage = {
        id: roomId,
        user: data.playerId,
        content: data.message,
        timestamp: new Date(),
      };

      if (!chatRoomid) setRoomId(roomId);

      if (data.playerId !== playerId) {
        setMessageSeen([messageSeen[0] + 1, messages.length]);

        toast(`New message`, {
          duration: 5000,
          className: "flex justify-between",
          action: (
            <Button
              variant="outline"
              onClick={() => {
                setMessageSeen([0, messages.length]);
                toast.dismiss();
              }}
            >
              View
            </Button>
          ),
          description: data.message,
        });
      }
      addMessage(newMessage);
    });

    return () => {
      channel.unbind("chat");
      pusherClient.unsubscribe(`${roomId}`);
    };
  }, [pusherClient, roomId, addMessage, playerId, setMessageSeen]);

  return (
    <div className="fixed right-[18%] top-50 w-80 bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-white flex flex-col shadow-xl backdrop-blur-sm max-sm:hidden h-[38rem] rounded-lg border border-gray-200 dark:border-gray-700/50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Game Chat</h2>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Online
          </span>
        </div>
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto no-scrollbar bg-gray-50/50 dark:bg-gray-900/50"
        ref={(el) => {
          if (el) el.scrollTop = el.scrollHeight;
        }}
      >
        {messages && messages.length > 0 ? (
          <ChatMessage messages={messages} playerId={playerId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400 dark:text-gray-500">
            <MessageSquare className="h-16 w-16 opacity-50" />
            <div className="text-center">
              <p className="font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-100/80 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700/50 rounded-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (message.trim()) {
              sendMessage(roomId, message, playerId);
              setMessage("");
            }
          }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-white dark:bg-gray-700/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all border border-gray-200 dark:border-gray-700"
          />
          <Button
            className="rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-blue-600 transition-colors"
            variant="default"
            disabled={!message.trim()}
            type="submit"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatSidebar;
