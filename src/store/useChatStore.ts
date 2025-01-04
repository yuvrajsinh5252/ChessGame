import { create } from "zustand";

export interface Message {
  id: string;
  user: string;
  name: string;
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
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
}

const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isOpen: true,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setRoomId: (roomId: string) => set({ roomId }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [], roomId: undefined }),
}));

export default useChatStore;
