"use client";

import useOnlineChessStore from "@/store/useOnlineChessStore";
import { EliminatedPieces } from "../eliminated";

export function White() {
  const { gameState } = useOnlineChessStore((state) => state);
  const { currentPlayer, eliminatedPieces } = gameState;

  return (
    <div
      className={
        "bg-gray-800/20 dark:bg-white/30 rounded-lg h-10 w-full flex px-4 items-center justify-between " +
        (currentPlayer === "white" ? "opacity-100" : "opacity-50")
      }
    >
      <div className="flex items-center justify-center">
        <span className="inline-block w-4 h-4 bg-white rounded-full mr-2"></span>
        <span>White</span>
      </div>
      <div>
        <EliminatedPieces
          playerColour={"white"}
          eliminatedPieces={eliminatedPieces}
        />
      </div>
    </div>
  );
}
