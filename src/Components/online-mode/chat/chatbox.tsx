"use client";

import { useEffect, useState } from "react";
import { MessageSquare, MessageSquareMore } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import useStore from "@/lib/hooks/useStore";
import useChatStore from "@/store/useChatStore";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/lib/db/chat/chat-server";
import { ChatMessage } from "./message";

export default function Chat({
  playerId,
  roomId,
}: {
  playerId: string;
  roomId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
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
      addMessage(newMessage);
    });

    return () => {
      channel.unbind("chat");
      pusherClient.unsubscribe(`${roomId}`);
    };
  }, [pusherClient, roomId, addMessage, playerId]);

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
        className={`fixed bg-white dark:bg-gray-800 bottom-0 left-1/2 transform -translate-x-[53%] translate-y-1/2 m-4 w-[600px] shadow-lg rounded-lg transition-transform ${
          isOpen ? "translate-y-full" : "-translate-y-[200%]"
        }`}
        style={{ transitionDuration: "300ms" }}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Chat</h2>
        </div>
        <div className="p-4 overflow-y-auto no-scrollbar h-96">
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
