import { ChessState } from "@/types/chess";
import { checkCastling } from "@/utils/castle";
import { CheckEnpassant } from "@/utils/enpassant";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";
import { isCheckMate, isKingInCheck } from "@/utils/kingCheck";
import { isMoveValid } from "@/utils/validMove";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Piece = string | null;
export type Board = Piece[][];

export const useChessStore = create(
  persist<ChessState>(
    (set, get) => ({
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

        if (
          lastMove &&
          CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, lastMove)
        )
          newBoard[lastMove.toRow][lastMove.toCol] = null;

        const data = checkCastling(
          fromRow,
          fromCol,
          toRow,
          toCol,
          newBoard,
          currentPlayer,
          get().rookMoved,
          get().kingCheckOrMoved
        );
        if (data) {
          newBoard[fromRow][data.rookCol] = null;
          newBoard[fromRow][data.newRookCol] = data.rook;
        }

        // Move the piece to the new position
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;

        // Check if the move puts the current player's king in check
        if (isKingInCheck(newBoard, currentPlayer)) return false;

        set((state) => ({
          ...state,
          board: newBoard,
          isKingInCheck: isKingInCheck(
            newBoard,
            currentPlayer === "white" ? "black" : "white"
          )
            ? currentPlayer === "white"
              ? "k"
              : "K"
            : "noCheck",
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
          isCheckMate: isCheckMate(
            newBoard,
            currentPlayer == "white" ? "black" : "white"
          ),
        }));

        return true;
      },

      isValidMove: (fromRow, fromCol, toRow, toCol) => {
        const { board, currentPlayer, kingCheckOrMoved, rookMoved } = get();
        const newBoard = board.map((row) => [...row]);
        const piece = newBoard[fromRow][fromCol];
        if (!piece) return false;

        const isWhitePiece = piece === piece.toUpperCase();
        if (
          (currentPlayer === "white" && !isWhitePiece) ||
          (currentPlayer === "black" && isWhitePiece)
        )
          return false;

        if (
          checkCastling(
            fromRow,
            fromCol,
            toRow,
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
      isCheckMate: "noCheckMate",
    }),
    {
      name: "chess-store",
      getStorage: () => localStorage,
    }
  )
);
