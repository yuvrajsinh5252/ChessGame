"use client";

import { useRef } from "react";
import { joinQueue } from "@/lib/db/online-players/search";
import useMatchStore from "@/store/useMatchStore";
import { useStore } from "zustand";

export function Matchmaking() {
  const { setMatchMaking, playerId, setPlayerId } = useStore(
    useMatchStore,
    (state) => state
  );
  const playerIdRef = useRef(
    crypto.randomUUID().replace(/-/g, "").slice(0, 16)
  );

  const handleSearch = async () => {
    setMatchMaking(true);
    setPlayerId(playerIdRef.current);
    if (!playerId) await new Promise((resolve) => setTimeout(resolve, 1000));
    await joinQueue(playerId);
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
