"use client";

import { useState } from "react";
import { MessageSquare, MessageSquareMore } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import useStore from "@/lib/hooks/useStore";
import useChatStore from "@/store/useChatStore";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const chatStore = useStore(useChatStore, (state) => state);
  if (!chatStore) return null;

  const { messages, addMessage } = chatStore;

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 relative"
        variant="ghost"
      >
        <MessageSquare />
        {messages.length > 0 && (
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
        )}
      </Button>
      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-[53%] translate-y-1/2 m-4 w-[600px] bg-white shadow-lg rounded-lg transition-transform ${
          isOpen ? "-translate-y-28" : "translate-y-full"
        }`}
        style={{ transitionDuration: "300ms" }}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Chat</h2>
        </div>
        <div className="p-4 overflow-y-auto h-96">
          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <div key={i} className="flex items-center mb-2">
                <MessageSquareMore className="mr-2" />
                <span>{msg.toString()}</span>
              </div>
            ))
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
          <Button className="mt-2 w-full">Send</Button>
        </div>
      </div>
    </div>
  );
}
