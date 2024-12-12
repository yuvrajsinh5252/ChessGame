"use client";

import useStore from "@/lib/hooks/useStore";
import { useChessStore } from "@/store/useChessStore";
import { EliminatedPieces } from "../eliminated";
import { GrRobot } from "react-icons/gr";

export function WhitePlayer() {
  const store = useStore(useChessStore, (state) => state);
  const { eliminatedPieces, currentPlayer, computer } = store! || {
    eliminatedPieces: { white: [], black: [] },
    currentPlayer: "white",
  };

  if (!store) return null;

  return (
    <div
      className={
        "bg-gray-800/20 dark:bg-white/30 rounded-lg h-10 w-full flex px-4 items-center justify-between " +
        (currentPlayer === "white" ? "opacity-100" : "opacity-50")
      }
    >
      <div className="flex items-center justify-center">
        <span className="inline-block w-4 h-4 bg-white rounded-full mr-2"></span>
        <div className="flex justify-center items-center gap-2">
          <span>White</span>
          <span>{computer == "white" ? <GrRobot size={20} /> : null}</span>
        </div>
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
