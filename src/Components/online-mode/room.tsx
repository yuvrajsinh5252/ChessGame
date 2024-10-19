"use client";

import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { LoaderIcon } from "lucide-react";

export default function Room() {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [roomid, setRoomid] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!roomid || !playerId) return;

    const channel = pusherClient.subscribe(`room-${roomid}`);
    channel.bind("player-joined", () => {
      setLoading(false);
      router.push(`/online-multiplayer/room/${roomid}?playerId=${playerId}`);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`room-${playerId}`);
    };
  }, [roomid, playerId, pusherClient, router]);

  const createRoom = async () => {
    setLoading(true);
    const res = await fetch("/api/rooms/create", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    const roomId = data.roomId;
    const playerId = data.playerId;

    if (res.status === 200) {
      setRoomid(roomId);
      setPlayerId(playerId);
    }

    if (roomId) setRoomid(roomId);
    else setRoomid("Error");
  };

  const joinRoom = async (roomId: string) => {
    if (playerId) {
      alert("You are already in a room");
      return;
    }

    const res = await fetch(`/api/rooms/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });

    const data = await res.json();
    const OtherplayerId = data.playerId;

    if (res.status === 404) setRoomid("Room not found");
    else if (res.status === 400) setRoomid("Room is full");
    else if (res.status === 200) {
      router.push(
        `/online-multiplayer/room/${roomId}?playerId=${OtherplayerId}`
      );
    }
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
        {loading ? (
          <div className="mt-2 w-full opacity-50 flex justify-center bg-blue-500 p-2 rounded ">
            <LoaderIcon className="animate-spin" />
          </div>
        ) : (
          <button
            onClick={() => createRoom()}
            className="mt-2 w-full bg-blue-500 p-2 rounded"
          >
            Create Room
          </button>
        )}
      </div>

      <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
        <div className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
          {roomid ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">
                Room ID: {roomid}
              </p>
              <p className="text-sm">Share this ID to start the game.</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click &quot;Create Room&quot; or enter a room ID to join.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
