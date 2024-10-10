"use client"

import { useChessStore } from "@/store/useChessStore";

export function BlackPlayer() {
  const { currentPlayer } = useChessStore((state) => state);

  return (
    <div className={"bg-gray-800/20 dark:bg-white/30 rounded-lg h-10 w-full flex justify-center items-center " +
      (currentPlayer === "black" ? "opacity-100" : "opacity-50")
    }>
      <span className="inline-block w-4 h-4 bg-black rounded-full mr-2"></span>
      Black
    </div>
  );
}