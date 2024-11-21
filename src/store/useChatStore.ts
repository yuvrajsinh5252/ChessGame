import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const useChatStore = create(
  persist<ChatStore>(
    (set, get) => ({
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: "chat-store", getStorage: () => localStorage }
  )
);

export default useChatStore;
