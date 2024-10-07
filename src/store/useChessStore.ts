import { ChessState } from "@/types/chess";
import { isKingInCheck, isMoveValid } from "@/utils/isValid";
import { create } from "zustand";

export type Piece = string | null;
export type Board = Piece[][];

const initialBoard: Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

export const useChessStore = create<ChessState>((set, get) => ({
  board: initialBoard,
  currentPlayer: "white",
  lastMove: null,
  movePiece: (fromRow, fromCol, toRow, toCol) => {
    const { board, currentPlayer, isValidMove, lastMove } = get();
    if (!isValidMove(fromRow, fromCol, toRow, toCol)) return false;

    const newBoard = board.map((row) => [...row]);
    const piece = newBoard[fromRow][fromCol];
    if (!piece) return false;

    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (currentPlayer === "white" && !isWhitePiece) ||
      (currentPlayer === "black" && isWhitePiece)
    )
      return false;

    // Handle en passant capture
    if (
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
        newBoard[lastMove.toRow][lastMove.toCol] = null;
      }
    }

    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    // Check if the move puts the current player's king in check
    if (isKingInCheck(newBoard, currentPlayer)) return false;
    if (isKingInCheck(newBoard, currentPlayer === "white" ? "black" : "white"))
      set((state) => ({
        ...state,
        isKingInCheck: currentPlayer == "white" ? "k" : "K",
      }));
    else set((state) => ({ ...state, isKingInCheck: "noCheck" }));

    set((state) => ({
      ...state,
      board: newBoard,
      currentPlayer: currentPlayer === "white" ? "black" : "white",
      lastMove: { fromRow, fromCol, toRow, toCol },
    }));
    return true;
  },

  isValidMove: (fromRow, fromCol, toRow, toCol) => {
    const { board, currentPlayer, lastMove } = get();
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (currentPlayer === "white" && !isWhitePiece) ||
      (currentPlayer === "black" && isWhitePiece)
    )
      return false;

    // Check for en passant move
    if (
      piece.toLowerCase() === "p" &&
      Math.abs(fromRow - toRow) === 1 &&
      Math.abs(fromCol - toCol) === 1 &&
      !board[toRow][toCol]
    ) {
      if (
        lastMove &&
        lastMove.toRow === fromRow &&
        Math.abs(lastMove.fromRow - lastMove.toRow) === 2 &&
        lastMove.toCol === toCol
      ) {
        return true;
      }
    }

    // check if the move is valid using the isValidMove function
    return isMoveValid(board, fromRow, fromCol, toRow, toCol);
  },

  isKingInCheck: "noCheck",
}));
