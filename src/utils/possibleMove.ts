import { Board } from "@/store/useChessStore";
import { isMoveValid } from "./validMove";
import { isKingInCheck } from "./kingCheck";
import { checkCastling } from "./castle";
import { CheckEnpassant } from "./enpassant";
import { kingCheckOrMoved, NullableLastMove, rookMoved } from "@/types/chess";

export const isMovePossible: (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  currentPlayer: "white" | "black",
  lastMove?: NullableLastMove,
  rookMoved?: rookMoved,
  kingCheckOrMoved?: kingCheckOrMoved
) => boolean = (
  board,
  fromRow,
  fromCol,
  toRow,
  toCol,
  currentPlayer,
  lastMove,
  rookMoved,
  kingCheckOrMoved
) => {
  const piece = board[fromRow][fromCol];
  if (!piece || !isMoveValid(board, fromRow, fromCol, toRow, toCol)) {
    return false;
  }

  // Create a copy of the board to simulate the move
  const newBoard = board.map((row) => row.slice());
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;

  if (
    lastMove &&
    CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, lastMove)
  ) {
    newBoard[lastMove.toRow][lastMove.toCol] = null;
  }

  if (rookMoved && kingCheckOrMoved) {
    const data = checkCastling(
      fromRow,
      fromCol,
      toRow,
      toCol,
      newBoard,
      currentPlayer,
      rookMoved,
      kingCheckOrMoved
    );
    if (data) {
      newBoard[fromRow][data.rookCol] = null;
      newBoard[fromRow][data.newRookCol] = data.rook;
    }
  }

  // Check if the move leaves the king in check
  const color = piece === piece.toUpperCase() ? "white" : "black";
  if (isKingInCheck(newBoard, color)) return false;

  return true;
};
