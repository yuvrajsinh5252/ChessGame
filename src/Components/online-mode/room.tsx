"use client";

import { Input } from "../ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Room() {
  const router = useRouter();
  const [id, setId] = useState<string>("");

  const createRoom = async () => {
    const res = await fetch("/api/rooms/create");
    const roomId: string = await res.text();
    router.push(`/online-multiplayer/room/${roomId}`);
  };

  const joinRoom = async (roomId: string) => {
    router.push(`/online-multiplayer/room/${roomId}`);
  };

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
          onClick={() => joinRoom(id)}
          className="mt-2 w-full bg-blue-500 p-2 rounded"
        >
          Join Room
        </button>
        <button
          onClick={createRoom}
          className="mt-2 w-full bg-blue-500 p-2 rounded"
        >
          Create Room
        </button>
      </form>
    </div>
  );
}
