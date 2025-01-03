"use client";

import { useEffect, useState, useRef } from "react";
import { pusherClient } from "@/lib/pusher";
import { LoaderIcon } from "lucide-react";
import {
  joinQueue,
  leaveQueue,
  matchPlayers,
} from "@/lib/db/online-players/search";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";

interface MatchmakingProps {
  setMatchMaking: (value: boolean) => void;
  matchMaking: boolean;
}

const myPlayerId = Math.random().toString(36).substring(7);

export function Matchmaking({ setMatchMaking, matchMaking }: MatchmakingProps) {
  const router = useRouter();
  const matchMakingRef = useRef(matchMaking);
  const playerIdRef = useRef(myPlayerId);

  useEffect(() => {
    matchMakingRef.current = matchMaking;
  }, [matchMaking]);

  useEffect(() => {
    if (!matchMaking) return;

    const channel = pusherClient.subscribe("queue");

    channel.bind(
      "match-found",
      (data: { player1: string; player2: string; roomId: string }) => {
        if (
          data.player1 === playerIdRef.current ||
          data.player2 === playerIdRef.current
        ) {
          setMatchMaking(false);
          router.push(
            `/online-multiplayer/room/${data.roomId}?playerId=${
              data.player1 === playerIdRef.current ? data.player1 : data.player2
            }`
          );
        }
      }
    );

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("queue");
      if (matchMakingRef.current) {
        leaveQueue(playerIdRef.current);
      }
    };
  }, [matchMaking, router, setMatchMaking]);

  const handleSearch = async () => {
    setMatchMaking(true);
    await joinQueue(myPlayerId);
  };

  return (
    <button
      onClick={handleSearch}
      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
    >
      Global search
    </button>
  );
}

export function FindingMatch({ setMatchMaking }: MatchmakingProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-ping"></div>
          <LoaderIcon className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400 relative z-10" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Searching for Players
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This might take a few moments...
          </p>
        </div>
      </div>
      <Button
        onClick={() => {
          setMatchMaking(false);
          leaveQueue(myPlayerId);
        }}
        variant="outline"
        className="w-full h-12 mt-4 border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
      >
        Cancel Matchmaking
      </Button>
    </div>
  );
}
