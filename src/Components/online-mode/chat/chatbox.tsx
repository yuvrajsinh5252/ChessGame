"use client";

import { useEffect, useState } from "react";
import { CircleX, MessageSquare } from "lucide-react";
import { Input } from "@/Components/ui/input";
import useChatStore from "@/store/useChatStore";
import { pusherClient } from "@/lib/pusher";
import { getMessages, sendMessage } from "@/lib/actions/chat/chat-server";
import { ChatMessage } from "./message";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";

function Chat({ roomId }: { roomId: string }) {
  const { data: session } = useSession();
  const playerId = session?.user?.id;
  const playerName = session?.user?.name;

  const [message, setMessage] = useState("");
  const chatStore = useChatStore((state) => state);
  const { isOpen, setIsOpen } = useChatStore((state) => state);
  const [messageSeen, setMessageSeen] = useState([0, 0]);

  const {
    messages,
    addMessage,
    setRoomId,
    roomId: chatRoomId,
    setMessages,
  } = chatStore! || {
    messages: [],
    setRoomId() {},
    addMessage: () => {},
    setMessages: () => {},
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(roomId);

      const Message = messages.map((message) => ({
        id: message.roomId,
        user: message.userId,
        name: message.userName,
        content: message.content,
        timestamp: message.createdAt,
      }));

      setMessages(Message);
    };

    fetchMessages();

    const channel = pusherClient.subscribe(`${roomId}`);
    channel.bind(
      "chat",
      (data: { message: string; playerId: string; name: string }) => {
        const newMessage = {
          id: roomId,
          user: data.playerId,
          name: data.name,
          content: data.message,
          timestamp: new Date(),
        };

        if (!chatRoomId) setRoomId(roomId);

        if (data.playerId !== playerId && isOpen) {
          setMessageSeen([messageSeen[0] + 1, messages.length]);

          toast(`New message`, {
            duration: 5000,
            className: "flex justify-between",
            action: (
              <Button
                className="sm:hidden"
                variant="outline"
                onClick={() => {
                  setMessageSeen([0, messages.length]);
                  setIsOpen(false);
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
      }
    );

    return () => {
      channel.unbind("chat");
      pusherClient.unsubscribe(`${roomId}`);
    };
  }, [pusherClient, roomId, addMessage, playerId, setIsOpen, setMessageSeen]);

  if (!playerId || !playerName) return null;

  return (
    <>
      <div className="relative z-50 sm:hidden">
        <Button
          onClick={() => {
            setIsOpen(!isOpen);
            setMessageSeen([0, messages.length]);
          }}
          className="p-2 relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          variant="ghost"
        >
          <MessageSquare className="h-6 w-6" />
          {messageSeen[0] > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
              {messageSeen[0]}
            </span>
          )}
        </Button>
        <div
          className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 ${
            isOpen ? "-translate-y-20" : "translate-y-full" // Changed from translate-y-[120%] and max-sm:translate-y-[100%]
          } bg-white dark:bg-gray-800 w-[340px] sm:w-[600px] shadow-xl rounded-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 z-[60]`} // Added z-[60]
        >
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-t-lg">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Chat Room</h2>
            </div>
            <CircleX
              className="cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => setIsOpen(true)}
            />
          </div>
          <div
            className="p-4 overflow-y-auto h-96 max-sm:h-64 no-scrollbar"
            ref={(el) => {
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }}
          >
            {messages && messages.length > 0 ? (
              <ChatMessage messages={messages} playerId={playerId} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
                <span>No messages yet</span>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-t dark:border-gray-700">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    sendMessage(roomId, message, playerId, playerName);
                    setMessage("");
                  }
                }}
              />
              <Button
                className="mt-0 px-6"
                variant="default"
                disabled={!message.trim()}
                onClick={async () => {
                  if (message.trim()) {
                    await sendMessage(roomId, message, playerId, playerName);
                    setMessage("");
                  }
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { Suspense } from "react";
import { useSession } from "next-auth/react";

function ChatWrapper({ roomId }: { roomId: string }) {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <Chat roomId={roomId} />
    </Suspense>
  );
}

export default ChatWrapper;
