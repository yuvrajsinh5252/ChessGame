import { ChessState } from "@/types/chess";
import { CheckCastling } from "@/utils/castling";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initial-setup";
import { isKingInCheck, isMoveValid } from "@/utils/valid-move";
import { create } from "zustand";
// import { updateKingMoved, updateRookMoved } from "@/utils/castling";

export type Piece = string | null;
export type Board = Piece[][];

export const useChessStore = create<ChessState>((set, get) => ({
  board: initialBoard,
  currentPlayer: "white",
  lastMove: null,
  kingCheckOrMoved: intitialkingCheckOrMoved,
  rookMoved: initialRookMoved,

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
    if (
      isKingInCheck(newBoard, currentPlayer === "white" ? "black" : "white")
    ) {
      set((state) => ({
        ...state,
        kingCheckOrMoved: {
          ...state.kingCheckOrMoved,
          [currentPlayer]: true,
        },
        isKingInCheck: currentPlayer === "white" ? "k" : "K",
      }));
    } else set((state) => ({ ...state, isKingInCheck: "noCheck" }));

    set((state) => ({
      ...state,
      board: newBoard,
      kingCheckOrMoved:
        (currentPlayer === "black" && toRow === 0) ||
        (currentPlayer === "white" && toRow === 7)
          ? { ...state.kingCheckOrMoved, [currentPlayer]: true }
          : state.kingCheckOrMoved,
      rookMoved: {
        ...state.rookMoved,
        [currentPlayer]: {
          left: fromCol === 0 || fromCol === 4,
          right: fromCol === 7 || fromCol === 4,
        },
      },
      currentPlayer: currentPlayer === "white" ? "black" : "white",
      lastMove: { fromRow, fromCol, toRow, toCol },
    }));

    return true;
  },

  isValidMove: (fromRow, fromCol, toRow, toCol) => {
    const { board, currentPlayer, lastMove, kingCheckOrMoved, rookMoved } =
      get();
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

    if (
      CheckCastling(
        piece,
        fromRow,
        fromCol,
        toCol,
        board,
        currentPlayer,
        rookMoved,
        kingCheckOrMoved
      )
    )
      return true;

    // check if the move is valid using the isValidMove function
    return isMoveValid(board, fromRow, fromCol, toRow, toCol);
  },

  isKingInCheck: "noCheck",
  isCheckMate: (_player) => false,
}));
