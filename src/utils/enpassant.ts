import { Board } from "@/store/useChessStore";
import { lastMove, NullableLastMove } from "@/types/chess";

export const CheckEnpassant = (
  board: Board,
  { fromRow, fromCol, toRow, toCol }: lastMove,
  lastMove: NullableLastMove
): boolean => {
  if (lastMove == null) return false;
  const piece = board[fromRow][fromCol];

  if (
    piece &&
    piece.toLowerCase() === "p" &&
    Math.abs(fromRow - toRow) === 1 &&
    Math.abs(fromCol - toCol) === 1 &&
    !board[toRow][toCol]
  ) {
    const isWhitePawn = piece === "P";
    const isBlackPawn = piece === "p";
    const isMovingForward =
      (isWhitePawn && toRow < fromRow) || (isBlackPawn && toRow > fromRow);

    if (
      isMovingForward &&
      lastMove &&
      lastMove.toRow === fromRow &&
      Math.abs(lastMove.fromRow - lastMove.toRow) === 2 &&
      lastMove.toCol === toCol
    ) {
      board[lastMove.toRow][lastMove.toCol] = null;
      return true;
    }

    return false;
  }
  return false;
};
