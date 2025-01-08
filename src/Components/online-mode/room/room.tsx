"use client";

import { Input } from "../../ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { LoaderIcon } from "lucide-react";
import { ShareLink } from "./shareLink";
import { JoinGame } from "@/lib/actions/room/join-game";
import useChatStore from "@/store/useChatStore";
import { Button } from "@/Components/ui/button";
import { Matchmaking } from "./matchMaking";
import { useStore } from "zustand";
import useMatchStore from "@/store/useMatchStore";
import { FindingMatch } from "./findMatch";
import { signIn, useSession } from "next-auth/react";
import { CheckGame } from "@/lib/actions/room/check-game";
import { CreateRoom, DeleteRoom } from "@/lib/actions/room/crud-game";

export default function Room() {
  const { setRoomId: setRoomChatId } = useChatStore((state) => state);
  const { isMatchmaking } = useStore(useMatchStore, (state) => state);

  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [roomid, setRoomid] = useState<string>("");
  const [isGame, setIsGame] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<{
    join: boolean;
    create: boolean;
    check: boolean;
    enter: boolean;
  }>({
    join: false,
    create: false,
    check: true,
    enter: false,
  });

  const { data: session, status } = useSession();
  const playerId = session?.user?.id;

  useEffect(() => {
    if (!roomid || !playerId) return;

    const channel = pusherClient.subscribe(`room-${roomid}`);
    channel.bind("player-joined", () => {
      setIsLoading((prev) => ({ ...prev, enter: true }));
      setRoomChatId(roomid);
      router.push(
        `/online-multiplayer/room/${roomid}?playerId=${session.user?.name}`
      );
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`room-${roomid}`);
    };
  }, [roomid, playerId, router, setRoomChatId]);

  useEffect(() => {
    const checkExistingGame = async () => {
      if (!playerId) {
        setIsLoading((prev) => ({ ...prev, check: false }));
        return;
      }

      try {
        const game = await CheckGame(playerId);

        if (game && game.roomId && (game.winner == "none" || !game.winner)) {
          setRoomChatId(game.roomId);
          setRoomid(game.roomId);
          if (game.players.length == 2) setIsGame(true);
        }
      } catch (error) {
        console.error("Failed to check existing game:", error);
      } finally {
        setIsLoading((prev) => ({ ...prev, check: false }));
      }
    };

    checkExistingGame();
  }, [playerId, router, setRoomChatId]);

  if (isGame && roomid && !isLoading.check) {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              You are already in a game
            </span>
            <Button
              onClick={() =>
                router.push(
                  `/online-multiplayer/room/${roomid}?playerId=${playerId}`
                )
              }
              className="w-full h-12 font-medium rounded-lg transition-all duration-200"
            >
              Go to Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (
    status === "loading" ||
    (status === "authenticated" && isLoading.check) ||
    status === "unauthenticated"
  ) {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            {status === "loading" ||
            (status === "authenticated" && isLoading.check) ? (
              <>
                <LoaderIcon className="animate-spin h-6 w-6 text-gray-900 dark:text-gray-100" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Checking existing games...
                </span>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  You need to be signed in to create or join a room
                </span>
                <Button
                  onClick={() => signIn()}
                  className="w-full h-12 font-medium rounded-lg transition-all duration-200"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const createRoom = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, create: true }));
      const data = await CreateRoom(playerId!);
      const roomId = data.roomId;

      if (roomId) {
        setRoomid(roomId);
      } else {
        throw new Error("Failed to create room");
      }
    } catch (error) {
      setRoomid("Error");
    } finally {
      setIsLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!roomId.trim()) {
      alert("Please enter a room ID");
      return;
    }

    try {
      setIsLoading((prev) => ({ ...prev, join: true }));
      const data = await JoinGame({ roomId, playerId: playerId! });
      if (data === "Error") {
        alert("Room not found, full, or you are already in a room");
        setRoomid("Error");
        return;
      }

      setRoomChatId(roomId);
      setIsLoading((prev) => ({ ...prev, enter: true }));
      router.push(`/online-multiplayer/room/${roomId}?playerId=${playerId}`);
    } catch (error) {
      alert("Failed to join room");
    } finally {
      setIsLoading((prev) => ({ ...prev, join: false }));
    }
  };

  const handleDelete = async () => {
    await DeleteRoom(roomid);
    setRoomid("");
  };

  return (
    <div className="w-full max-w-md mx-auto p-8">
      {isMatchmaking ? (
        <FindingMatch setIsLoading={setIsLoading} />
      ) : !isLoading.enter ? (
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
              {isLoading.join ? (
                <Button disabled className="w-full h-12">
                  <LoaderIcon className="animate-spin h-4 w-4 mr-2" />
                  Joining...
                </Button>
              ) : (
                <Button
                  onClick={() => joinRoom(id)}
                  disabled={roomid !== "" && roomid !== "Error"}
                  className="w-full h-12 font-medium rounded-lg transition-all duration-200"
                >
                  Join Room
                </Button>
              )}
              {isLoading.create ? (
                <Button disabled className="w-full h-12">
                  <LoaderIcon className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </Button>
              ) : (
                <button
                  onClick={() => createRoom()}
                  disabled={roomid !== "" && roomid !== "Error"}
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
                <ShareLink onDelete={handleDelete} roomid={roomid} />
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
          <Matchmaking playerId={playerId!} />
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
