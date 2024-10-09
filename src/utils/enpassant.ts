import { Board } from "@/store/useChessStore";
import { NullableLastMove } from "@/types/chess";

export const CheckEnpassant = (
  newBoard: Board,
  {
    fromRow,
    fromCol,
    toRow,
    toCol,
  }: { fromRow: number; fromCol: number; toRow: number; toCol: number },
  lastMove: NullableLastMove
) => {
  const piece = newBoard[fromRow][fromCol];
  if (
    piece &&
    piece.toLowerCase() === "p" &&
    Math.abs(fromRow - toRow) === 1 &&
    Math.abs(fromCol - toCol) === 1 &&
    !newBoard[toRow][toCol]
  ) {
    if (
      lastMove &&
      lastMove.toRow === fromRow &&
      Math.abs(lastMove.fromRow - lastMove.toRow) === 2 &&
      lastMove.toCol === toCol
    ) {
      return true;
    }

    return false;
  }
};
