import { create } from "zustand";

type Piece = string | null;
type Board = Piece[][];

interface ChessState {
  board: Board;
  movePiece: (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => void;
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

export const useChessStore = create<ChessState>((set) => ({
  board: initialBoard,
  movePiece: (fromRow, fromCol, toRow, toCol) =>
    set((state) => {
      const newBoard = state.board.map((row) => [...row]);
      newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
      newBoard[fromRow][fromCol] = null;
      return { board: newBoard };
    }),
}));
