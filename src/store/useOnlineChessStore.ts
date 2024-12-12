import { OnlineChessStore, OnlineChessStoreActions } from "@/types/onlineChess";
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
      movingPiece: null,
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

      set({
        gameState: {
          ...gameState,
          movingPiece: { fromRow, fromCol, toRow, toCol },
          lastMove: { fromRow, fromCol, toRow, toCol },
        },
      });

      setTimeout(() => {
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
              left:
                (fromCol === 0 &&
                  fromRow === 0 &&
                  board[fromCol][fromRow] == "r") ||
                (fromCol === 0 &&
                  fromRow === 7 &&
                  board[fromCol][fromRow] == "R"),
              right:
                (fromCol === 7 &&
                  fromRow === 0 &&
                  board[fromCol][fromRow] == "r") ||
                (fromCol === 7 &&
                  fromRow === 7 &&
                  board[fromCol][fromRow] == "R"),
            },
          },
          currentPlayer: currentPlayer === "white" ? "black" : "white",
          lastMove: { fromRow, fromCol, toRow, toCol },
        });
      }, 300);

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

    updateGameState: (newGameState) => {
      const { lastMove } = newGameState;

      set({
        gameState: {
          ...get().gameState,
          movingPiece: lastMove!,
          lastMove: lastMove!,
        },
      });
      setTimeout(
        () =>
          set((state) => {
            const newState = {
              gameState: {
                ...state.gameState,
                ...newGameState,
              },
            };
            return newState;
          }),
        200
      );
    },

    updatePlayersState: (players) => {
      if (players && players.length > 0) set({ players: players });
    },
  })
);

export default useOnlineChessStore;
