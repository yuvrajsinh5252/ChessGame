"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import useStore from "@/lib/hooks/useStore";
import useChatStore from "@/store/useChatStore";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/lib/db/chat/chat-server";
import { ChatMessage } from "./message";
import { toast } from "sonner";

export default function Chat({
  playerId,
  roomId,
}: {
  playerId: string;
  roomId: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const chatStore = useStore(useChatStore, (state) => state);

  const {
    messages,
    addMessage,
    setRoomId,
    roomId: chatRoomid,
  } = chatStore! || {
    messages: [],
    setRoomId(roomId) {},
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
        toast(`New message`, {
          duration: 5000,
          action: (
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              Undo
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
  }, [pusherClient, roomId, addMessage, playerId, setIsOpen]);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 relative"
        variant="ghost"
      >
        <MessageSquare />
        {messages && messages.length > 0 && (
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
        )}
      </Button>
      <div
        className={`fixed bottom-0 -translate-y-20 left-1/2 transform -translate-x-1/2 ${
          isOpen ? "-translate-y-20" : "translate-y-[120%]"
        } bg-white dark:bg-gray-800 w-[340px] sm:w-[600px] shadow-lg rounded-lg transition-transform duration-300`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Chat</h2>
        </div>
        <div
          className="p-4 overflow-y-auto no-scrollbar h-96 max-sm:h-64"
          ref={(el) => {
            if (el) {
              el.scrollTop = el.scrollHeight;
            }
          }}
        >
          {messages && messages.length > 0 ? (
            <ChatMessage messages={messages} playerId={playerId} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span>No messages yet</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <Textarea
            placeholder="Type a message..."
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            className="mt-2 w-full"
            onClick={async () => {
              await sendMessage(roomId, message, playerId);
              setMessage("");
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
