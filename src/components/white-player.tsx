"use client"

import { useChessStore } from "@/store/useChessStore";

export function WhitePlayer() {
  const { currentPlayer } = useChessStore((state) => state);

  return (
    <div className={"bg-gray-800/20 dark:bg-white/30 rounded-lg h-10 w-full flex justify-center items-center " +
      (currentPlayer === "white" ? "opacity-100" : "opacity-50")
    }>
      <span className="inline-block w-4 h-4 bg-white rounded-full mr-2"></span>
      White
    </div>
  );
}