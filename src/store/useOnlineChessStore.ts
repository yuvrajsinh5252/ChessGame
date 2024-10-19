import {
  OnlineChessStore,
  OnlineChessStoreActions,
  Player,
} from "@/types/onlineChess";
import { checkCastling } from "@/utils/castle";
import { CheckEnpassant } from "@/utils/enpassant";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";
import { isKingInCheck } from "@/utils/kingCheck";
import { isMovePossible } from "@/utils/possibleMove";
import { create } from "zustand";

const useOnlineChessStore = create<OnlineChessStore & OnlineChessStoreActions>(
  (set, get) => ({
    players: [],
    gameState: {
      board: initialBoard,
      currentPlayer: "white",
      winner: "none",
      status: "waiting",
      lastMove: null,
      eliminatedPieces: { white: [], black: [] },
      kingCheckOrMoved: intitialkingCheckOrMoved,
      rookMoved: initialRookMoved,
      isKingInCheck: "noCheck",
      canPromotePawn: null,
    },

    movePiece: (fromRow, fromCol, toRow, toCol) => {
      const { gameState, isValidMove, updateGameState } = get();
      const { board, currentPlayer, lastMove } = gameState;

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
        get().gameState.rookMoved,
        get().gameState.kingCheckOrMoved
      );
      if (data) {
        newBoard[fromRow][data.rookCol] = null;
        newBoard[fromRow][data.newRookCol] = data.rook;
      }

      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = null;

      if (isKingInCheck(newBoard, currentPlayer)) return false;
      let OpponentKingCheck = false;
      if (
        isKingInCheck(newBoard, currentPlayer === "white" ? "black" : "white")
      )
        OpponentKingCheck = true;

      updateGameState({
        board: newBoard,
        isKingInCheck: OpponentKingCheck
          ? currentPlayer === "white"
            ? "k"
            : "K"
          : "noCheck",
        kingCheckOrMoved:
          (currentPlayer === "black" && toRow === 0) ||
          (currentPlayer === "white" && toRow === 7) ||
          (piece === "K" &&
            fromRow === 7 &&
            fromCol === 4 &&
            toRow === 7 &&
            toCol === 6) ||
          (piece === "k" &&
            fromRow === 0 &&
            fromCol === 4 &&
            toRow === 0 &&
            toCol === 6) ||
          OpponentKingCheck
            ? OpponentKingCheck
              ? {
                  ...gameState.kingCheckOrMoved,
                  [currentPlayer === "white" ? "black" : "white"]: true,
                }
              : {
                  ...gameState.kingCheckOrMoved,
                  [currentPlayer]: true,
                }
            : gameState.kingCheckOrMoved,
        rookMoved: {
          ...get().gameState.rookMoved,
          [currentPlayer]: {
            left: fromCol === 0 || fromCol === 4,
            right: fromCol === 7 || fromCol === 4,
          },
        },
        currentPlayer: currentPlayer === "white" ? "black" : "white",
        lastMove: { fromRow, fromCol, toRow, toCol },
      });

      return true;
    },

    isValidMove: (fromRow, fromCol, toRow, toCol) => {
      const { gameState } = get();
      const { board, currentPlayer, rookMoved, kingCheckOrMoved } = gameState;

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
        get().gameState.lastMove,
        rookMoved,
        kingCheckOrMoved
      );
    },

    promotePawn: (row, col, newPiece) => {
      const { gameState } = get();
      const { board, currentPlayer } = gameState;

      const newBoard = board.map((row) => [...row]);
      newBoard[row][col] =
        currentPlayer === "black" ? newPiece.toLowerCase() : newPiece;

      set({
        gameState: {
          ...gameState,
          board: newBoard,
          isKingInCheck: isKingInCheck(newBoard, currentPlayer)
            ? currentPlayer === "black"
              ? "K"
              : "k"
            : "noCheck",
          canPromotePawn: null,
        },
      });
    },

    updateGameState: (gameState) =>
      set((state) => {
        const newState = {
          gameState: {
            ...state.gameState,
            ...gameState,
          },
        };
        return newState;
      }),

    updatePlayersState: (players: Player[]) =>
      set((state) => {
        const newState = {
          ...state,
          players: players,
        };
        return newState;
      }),
  })
);

export default useOnlineChessStore;
