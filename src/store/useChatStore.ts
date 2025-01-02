import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
}

interface ChatStore {
  roomId?: string;
  messages: Message[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setRoomId: (roomId: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const useChatStore = create(
  persist<ChatStore>(
    (set) => ({
      messages: [],
      isOpen: true,
      setIsOpen: (isOpen: boolean) => set({ isOpen }),
      setRoomId: (roomId: string) => set({ roomId }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [], roomId: undefined }),
    }),
    { name: "chat-store", storage: createJSONStorage(() => localStorage) }
  )
);

export default useChatStore;
