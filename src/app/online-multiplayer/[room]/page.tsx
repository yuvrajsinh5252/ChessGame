"use client";

import { OnlineBoard } from "@/Components/online-mode/onlineboard";
import useRoomStore from "@/store/useRoomStore";
import { useStore } from "zustand";

export default function page({ params }: { params: { room: string } }) {
  const state = useStore(useRoomStore, (state) => state);
  if (!state.roomId)
    return (
      <div className="flex justify-center h-screen items-center">
        loading...
      </div>
    );

  if (state.roomId !== params.room)
    return (
      <div className="flex justify-center h-screen items-center">
        you are not in the right room
      </div>
    );

  return <OnlineBoard />;
}
