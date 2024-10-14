"use client";

import { Input } from "../ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";

export default function Room() {
  const router = useRouter();
  const [id, setId] = useState<string>("");

  const createRoom = async () => {
    const res = await fetch("/api/rooms/create");
    const roomId: string = await res.text();

    const channel = pusherClient.subscribe(`room-${roomId}`);
    channel.bind("player-joined", () => {
      router.push(`/online-multiplayer/room/${roomId}`);
    });
  };

  const joinRoom = async (roomId: string) => {
    const data = await fetch(`/api/rooms/getroom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });

    if (data.status === 404) {
      alert("Room not found");
      return;
    } else if (data.status === 400) {
      alert("Room is full");
      return;
    } else if (data.status === 200)
      router.push(`/online-multiplayer/room/${roomId}`);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
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
          onClick={async () => await createRoom()}
          className="mt-2 w-full bg-blue-500 p-2 rounded"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
