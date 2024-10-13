"use client";

import { useStore } from "zustand";
import { Input } from "../ui/input";
import useRoomStore from "@/store/useRoomStore";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function Room() {
  const state = useStore(useRoomStore, (state) => state);
  const isLoading = !state;
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (state.roomId) {
      redirect(`/online-multiplayer/${state.roomId}`);
      // window.location.href = `/online-multiplayer/${state.roomId}`;
    }
  }, [state.roomId]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-md">
      <form className="mb-4">
        <Input
          type="text"
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter room name"
          className="w-full dark:bg-gray-600"
        />
        <button
          onClick={() => id && state.joinRoom(id)}
          type="submit"
          className="mt-2 w-full bg-blue-500 p-2 rounded"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}
