"use client";

import useOnlineChessStore from "@/store/useOnlineChessStore";
import { EliminatedPieces } from "../common/eliminated";

export function Black() {
  const { gameState } = useOnlineChessStore((state) => state);
  const { currentPlayer, eliminatedPieces, status } = gameState;

  return (
    <div
      className={
        "bg-gray-800/20 dark:bg-white/30 rounded-lg h-10 w-full flex px-4 items-center justify-between " +
        (currentPlayer === "black" ? "opacity-100" : "opacity-50")
      }
    >
      <div className="flex items-center justify-center relative group">
        <span className="inline-block w-4 h-4 bg-black rounded-full mr-2"></span>
        <span>Black</span>
        {status === "promote" && currentPlayer === "black" && (
          <div className="absolute left-20 p-2 z-20 w-32 opacity-50 bg-white rounded-lg shadow-lg">
            <span className="text-[12px] text-gray-900">Promoting pawn...</span>
          </div>
        )}
      </div>
      <div>
        <EliminatedPieces
          playerColour={"black"}
          eliminatedPieces={eliminatedPieces}
        />
      </div>
    </div>
  );
}
