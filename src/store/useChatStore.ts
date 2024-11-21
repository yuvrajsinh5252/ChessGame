import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
}

interface ChatStore {
  roomId?: string;
  messages: Message[];
  setRoomId: (roomId: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const useChatStore = create(
  persist<ChatStore>(
    (set) => ({
      messages: [],
      setRoomId: (roomId: string) => set({ roomId }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: "chat-store", getStorage: () => localStorage }
  )
);

export default useChatStore;
