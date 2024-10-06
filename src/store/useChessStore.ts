import { isValidMove } from "@/utils/isValid";
import { create } from "zustand";

export type Piece = string | null;
export type Board = Piece[][];

interface ChessState {
  board: Board;
  currentPlayer: "white" | "black";
  movePiece: (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => boolean;
  isValidMove: (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => boolean | "" | null;
  isKingInCheck: "K" | "k" | "noCheck";
}

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
  movePiece: (fromRow, fromCol, toRow, toCol) => {
    const { board, currentPlayer, isValidMove } = get();
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

    set((state) => ({
      ...state,
      currentPlayer: currentPlayer === "white" ? "black" : "white",
    }));
    return true;
  },

  isValidMove: (fromRow, fromCol, toRow, toCol) => {
    const { board, currentPlayer } = get();
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (currentPlayer === "white" && !isWhitePiece) ||
      (currentPlayer === "black" && isWhitePiece)
    )
      return false;

    // check if the move is valid using the isValidMove function
    return isValidMove(board, fromRow, fromCol, toRow, toCol);
  },

  isKingInCheck: "noCheck",
}));
