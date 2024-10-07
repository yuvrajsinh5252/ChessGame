import { Board } from "@/store/useChessStore";
import { isKingInCheck, isMoveValid } from "./valid-move";

export const isMovePossible: (
  board: Board,
  row: number,
  col: number,
  toRow: number,
  toCol: number
) => boolean = (board, row, col, toRow, toCol) => {
  const piece = board[row][col];
  if (
    piece &&
    isMoveValid(board, row, col, toRow, toCol) &&
    !isKingInCheck(board, piece === piece.toUpperCase() ? "white" : "black")
  ) {
    return true;
  }

  return false;
};
