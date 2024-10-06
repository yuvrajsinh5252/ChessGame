import { create } from "zustand";
import { Piece, ChessState } from "@/types/chess";

const initialBoard: (Piece | null)[][] = [
  [
    { type: "rook", color: "black" },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black" },
  ],
  Array(8)
    .fill(null)
    .map(() => ({ type: "pawn", color: "black" })),
  ...Array(4).fill(Array(8).fill(null)),
  Array(8)
    .fill(null)
    .map(() => ({ type: "pawn", color: "white" })),
  [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ],
];

export const useChessStore = create<ChessState>((set) => ({
  board: initialBoard,
  currentPlayer: "white",
  selectedPiece: null,
  initializeGame: () => set({ board: initialBoard, currentPlayer: "white" }),
  selectPiece: (row: number, col: number) =>
    set((state) => ({
      selectedPiece: { row, col, piece: state.board[row][col] },
    })),
  movePiece: (toRow: number, toCol: number) =>
    set((state) => {
      if (!state.selectedPiece) return state;

      const {
        row: fromRow,
        col: fromCol,
        piece: selectedPiece,
      } = state.selectedPiece;
      if (!selectedPiece) return state;

      const newBoard = state.board.map((row) => [...row]);

      newBoard[toRow][toCol] = selectedPiece;
      newBoard[fromRow][fromCol] = null;

      return {
        board: newBoard,
        selectedPiece: null,
        currentPlayer: state.currentPlayer === "white" ? "black" : "white",
      };
    }),
}));
