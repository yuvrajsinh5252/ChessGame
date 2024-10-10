"use client";

import { useChessStore } from "@/store/useChessStore";

export const ChoosePiece = () => {
  const { board, currentPlayer, isValidMove, movePiece } = useChessStore(
    (state) => state
  );

  return <div className="grid grid-cols-8 gap-1"></div>;
};
