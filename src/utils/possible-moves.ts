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
  if (!piece || !isMoveValid(board, row, col, toRow, toCol)) {
    return false;
  }

  // Create a copy of the board to simulate the move
  const newBoard = board.map((row) => row.slice());
  newBoard[toRow][toCol] = piece;
  newBoard[row][col] = null;

  // Check if the move leaves the king in check
  const color = piece === piece.toUpperCase() ? "white" : "black";
  if (isKingInCheck(newBoard, color)) return false;

  return true;
};
