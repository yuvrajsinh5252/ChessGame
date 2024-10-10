"use client";

import useStore from "@/lib/hooks/useStore";
import { useChessStore } from "@/store/useChessStore";

export function WhitePlayer() {
  const store = useStore(useChessStore, (state) => state);
  const { eliminatedPieces, currentPlayer } = store! || {
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
        <span>White</span>
      </div>
      <div>
        <div className="flex items-center justify-center gap-1">
          {eliminatedPieces ? (
            Object.entries(
              eliminatedPieces.white.reduce((acc, piece) => {
                if (piece) {
                  acc[piece] = (acc[piece] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>)
            ).map(([piece, count], index) => (
              <div
                key={index}
                className="relative flex items-center bg-gray-200 dark:bg-gray-700 p-0.5 px-1 rounded"
              >
                <img
                  src={`/white/${piece}.png`}
                  alt={piece}
                  className="w-6 h-6"
                />
                <div>
                  {count > 1 && (
                    <span className="right-0.5 bottom-[0%] absolute text-[10px] font-semibold">
                      {count}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
