import { RoomState } from "@/types/room";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useRoomStore = create(
  persist<RoomState>(
    (set) => ({
      roomId: null,
      isCreating: false,
      isJoining: false,
      createRoom: () => set({ isCreating: true, roomId: null }),
      joinRoom: (id: string) => set({ isJoining: true, roomId: id }),
      leaveRoom: () =>
        set({ roomId: null, isCreating: false, isJoining: false }),
    }),
    {
      name: "room-store",
    }
  )
);

export default useRoomStore;
