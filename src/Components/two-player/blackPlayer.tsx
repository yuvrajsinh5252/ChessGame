"use client";

import useStore from "@/lib/hooks/useStore";
import { useChessStore } from "@/store/useChessStore";
import { EliminatedPieces } from "../common/eliminated";
import { GrRobot } from "react-icons/gr";

export function BlackPlayer() {
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
        (currentPlayer === "black" ? "opacity-100" : "opacity-50")
      }
    >
      <div className="flex items-center justify-center">
        <span className="inline-block w-4 h-4 bg-black rounded-full mr-2"></span>
        <div className="flex justify-center items-center gap-2">
          <span>Black</span>
          <span>{computer == "black" ? <GrRobot size={20} /> : null}</span>
        </div>
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
