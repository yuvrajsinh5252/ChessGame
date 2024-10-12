import { ChessState, typePromotePawn } from "@/types/chess";
import { checkCastling } from "@/utils/castle";
import { CheckEnpassant } from "@/utils/enpassant";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";
import { isCheckMate, isKingInCheck } from "@/utils/kingCheck";
import { isMovePossible } from "@/utils/possibleMove";
import { promotePawn } from "@/utils/promotePawn";
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
      isKingInCheck: "noCheck",
      isCheckMate: "noCheckMate",
      eliminatedPieces: { white: [], black: [] },

      movePiece: (fromRow, fromCol, toRow, toCol) => {
        const { board, currentPlayer, isValidMove, lastMove } = get();
        if (!isValidMove(fromRow, fromCol, toRow, toCol)) return false;

        const newBoard = board.map((row) => [...row]);
        const piece = newBoard[fromRow][fromCol];

        let EliminatedPiece = null;

        if (
          lastMove &&
          CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, lastMove)
        ) {
          EliminatedPiece = newBoard[lastMove.toRow][lastMove.toCol];
          newBoard[lastMove.toRow][lastMove.toCol] = null;
        }

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
        if (newBoard[toRow][toCol]) EliminatedPiece = newBoard[toRow][toCol];
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
          canPromotePawn: promotePawn(
            board,
            fromRow,
            fromCol,
            toRow,
            toCol,
            currentPlayer
          ),
          eliminatedPieces: {
            ...state.eliminatedPieces,
            [currentPlayer === "white" ? "black" : "white"]: [
              ...state.eliminatedPieces[
                currentPlayer === "white" ? "black" : "white"
              ],
              EliminatedPiece,
            ],
          },
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

        return isMovePossible(
          newBoard,
          fromRow,
          fromCol,
          toRow,
          toCol,
          currentPlayer,
          get().lastMove,
          rookMoved,
          kingCheckOrMoved
        );
      },

      promotePawn: (row, col, newPiece) => {
        const { board, currentPlayer } = get();
        const newBoard = board.map((row) => [...row]);
        newBoard[row][col] =
          currentPlayer === "white" ? newPiece.toLowerCase() : newPiece;

        set({
          board: newBoard,
          canPromotePawn: null,
          isKingInCheck: isKingInCheck(newBoard, currentPlayer)
            ? currentPlayer === "white"
              ? "K"
              : "k"
            : "noCheck",
        });
      },
      canPromotePawn: null,
    }),
    {
      name: "chess-store",
      getStorage: () => localStorage,
    }
  )
);
