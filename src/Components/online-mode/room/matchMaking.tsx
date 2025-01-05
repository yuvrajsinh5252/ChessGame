"use client";

import useMatchStore from "@/store/useMatchStore";
import { useStore } from "zustand";
import { joinQueue } from "@/lib/db/online-players/join-queue";

export function Matchmaking({ playerId }: { playerId: string }) {
  const { setMatchMaking } = useStore(useMatchStore, (state) => state);

  const handleSearch = async () => {
    if (!playerId) return console.error("No player id found");
    setMatchMaking(true);
    const result = await joinQueue(playerId);

    if (!result.success) console.error(result.error);
    return result;
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
