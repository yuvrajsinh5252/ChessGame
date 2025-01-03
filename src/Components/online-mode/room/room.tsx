"use client";

import { Input } from "../../ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { LoaderIcon } from "lucide-react";
import { ShareLink } from "./shareLink";
import { CreateRoom } from "@/lib/db/room/create-game";
import { JoinGame } from "@/lib/db/room/join-game";
import useChatStore from "@/store/useChatStore";
import { Button } from "@/Components/ui/button";
import { FindingMatch, Matchmaking } from "./matchMaking";

export default function Room() {
  const { setRoomId: setRoomChatId } = useChatStore((state) => state);

  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [roomid, setRoomid] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [roomEnterLoading, setRoomEnterLoading] = useState<boolean>(false);
  const [matchMaking, setMatchMaking] = useState<boolean>(false);

  useEffect(() => {
    if (!roomid || !playerId) return;

    const channel = pusherClient.subscribe(`room-${roomid}`);
    channel.bind("player-joined", () => {
      setLoading(false);
      setRoomChatId(roomid);
      setRoomEnterLoading(true);
      router.push(`/online-multiplayer/room/${roomid}?playerId=${playerId}`);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`room-${roomid}`);
    };
  }, [roomid, playerId, router, setRoomChatId]);

  const createRoom = async () => {
    try {
      setLoading(true);
      const data = await CreateRoom();
      const roomId = data.roomId;
      const CurrentplayerId = data.playerId;

      if (roomId && CurrentplayerId) {
        setRoomid(roomId);
        setPlayerId(CurrentplayerId);
      } else {
        throw new Error("Failed to create room");
      }
    } catch (error) {
      setRoomid("Error");
      setLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!roomId.trim()) {
      alert("Please enter a room ID");
      return;
    }

    try {
      setJoinLoading(true);
      if (playerId) {
        alert("You are already in a room");
        setJoinLoading(false);
        return;
      }

      const data = await JoinGame({ roomId });
      if (data === "Error") {
        alert("Room not found or is full");
        setRoomid("Error");
        setJoinLoading(false);
        return;
      }

      const OtherplayerId = data?.playerId;
      if (data?.playerId) {
        setRoomChatId(roomId);
        setRoomEnterLoading(true);
        router.push(
          `/online-multiplayer/room/${roomId}?playerId=${OtherplayerId}`
        );
      }
    } catch (error) {
      alert("Failed to join room");
      setJoinLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8">
      {matchMaking ? (
        <FindingMatch
          setMatchMaking={setMatchMaking}
          matchMaking={matchMaking}
        />
      ) : !roomEnterLoading ? (
        <div className="space-y-8">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <h2 className="text-xl font-medium text-center mb-8 text-gray-900 dark:text-gray-100">
              Join or Create a Room
            </h2>
            <div className="space-y-6">
              <Input
                type="text"
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full h-12 px-4 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {joinLoading ? (
                <Button className="w-full h-12 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed bg-gray-50 dark:bg-gray-800 transition-all duration-200">
                  <LoaderIcon className="animate-spin h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Joining...</span>
                </Button>
              ) : (
                <Button
                  onClick={() => joinRoom(id)}
                  className="w-full h-12 font-medium rounded-lg transition-all duration-200"
                >
                  Join Room
                </Button>
              )}
              {loading ? (
                <button className="w-full h-12 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed bg-gray-50 dark:bg-gray-800 transition-all duration-200">
                  <LoaderIcon className="animate-spin h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Creating...</span>
                </button>
              ) : (
                <button
                  onClick={() => createRoom()}
                  className="w-full h-12 border border-gray-900 dark:border-gray-100 rounded-lg text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-all duration-200"
                >
                  Create Room
                </button>
              )}
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="text-center">
              {roomid ? (
                <ShareLink roomid={roomid} />
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter a room ID or create a new room to start playing
                  </p>
                  <div className="w-16 h-[1px] bg-gray-200 dark:bg-gray-700 mx-auto"></div>
                </div>
              )}
            </div>
          </div>
          <Matchmaking
            setMatchMaking={setMatchMaking}
            matchMaking={matchMaking}
          />
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoaderIcon className="animate-spin h-6 w-6 text-gray-900 dark:text-gray-100" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Entering the game...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
