"use client";

import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { LoaderIcon } from "lucide-react";
import { CreateRoom } from "@/lib/db/create-game";
import { JoinGame } from "@/lib/db/join-game";
import { ShareLink } from "./shareLink";

export default function Room() {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [roomid, setRoomid] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
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
    const data = await CreateRoom();
    const roomId = data.roomId;
    const CurrentplayerId = data.playerId;

    if (roomId && CurrentplayerId) {
      setRoomid(roomId);
      setPlayerId(CurrentplayerId);
    }

    if (roomId) setRoomid(roomId);
    else setRoomid("Error");
  };

  const joinRoom = async (roomId: string) => {
    setJoinLoading(true);
    if (playerId) {
      alert("You are already in a room");
      return;
    }

    const data = await JoinGame({ roomId });
    if (data === "Error") {
      setRoomid("Error");
      return;
    }

    const OtherplayerId = data?.playerId;
    if (data?.playerId) {
      setJoinLoading(false);
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
        {joinLoading ? (
          <div className="mt-2 w-full opacity-50 flex justify-center bg-blue-500 p-2 rounded ">
            <LoaderIcon className="animate-spin" />
          </div>
        ) : (
          <button
            onClick={() => joinRoom(id)}
            className="mt-2 w-full bg-blue-500 p-2 rounded"
          >
            Join Room
          </button>
        )}
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
            <ShareLink roomid={roomid} />
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
