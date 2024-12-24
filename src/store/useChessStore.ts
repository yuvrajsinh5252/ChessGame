import { getDB, STORE_NAME } from "@/lib/indexdb/initial";
import { ChessState, PieceColor } from "@/types/chess";
import { checkCastling } from "@/utils/castle";
import { CheckEnpassant } from "@/utils/enpassant";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";
import { isCheckMate, isKingInCheck } from "@/utils/kingCheck";
import { playSound, SoundType } from "@/utils/playSound";
import { isMovePossible } from "@/utils/possibleMove";
import { promotePawn } from "@/utils/promotePawn";
import { ConvertBoardToFEN } from "@/utils/stock-services/FENconverter";
import { GetBestMove } from "@/utils/stock-services/service";
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
      movingPiece: null,
      kingCheckOrMoved: intitialkingCheckOrMoved,
      rookMoved: initialRookMoved,
      isKingInCheck: "noCheck",
      isCheckMate: "noCheckMate",
      computer: null,
      stockfishLevel: 1,
      fiftyMoveRuleCounter: 0,
      numberOfFullMoves: 1,
      eliminatedPieces: { white: [], black: [] },
      historyIndex: -1,

      // Action to move a piece
      movePiece: (fromRow, fromCol, toRow, toCol) => {
        const { board, currentPlayer, isValidMove, lastMove, computer } = get();
        const state = get();
        if (!isValidMove(fromRow, fromCol, toRow, toCol)) return false;

        let sound: SoundType = "move";

        const newBoard = board.map((row) => [...row]);
        const piece = newBoard[fromRow][fromCol];

        let EliminatedPiece = null;
        let fiftyMoves = get().fiftyMoveRuleCounter;

        if (
          lastMove &&
          CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, lastMove)
        ) {
          EliminatedPiece = newBoard[lastMove.toRow][lastMove.toCol];
          newBoard[lastMove.toRow][lastMove.toCol] = null;
        }

        if (EliminatedPiece) sound = "capture";
        if (EliminatedPiece || piece?.toLowerCase() === "p") fiftyMoves = 0;
        else fiftyMoves++;

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
          sound = "castle";
        }

        if (newBoard[toRow][toCol]) EliminatedPiece = newBoard[toRow][toCol];
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;

        if (isKingInCheck(newBoard, currentPlayer)) return false;

        let OpponentKingCheck = false;
        if (
          isKingInCheck(newBoard, currentPlayer === "white" ? "black" : "white")
        ) {
          OpponentKingCheck = true;
          sound = "check";
        }

        set({
          lastMove: { fromRow, fromCol, toRow, toCol },
          movingPiece: { fromRow, fromCol, toRow, toCol },
        });

        let nextState: ChessState = {
          ...state,
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
                    ...state.kingCheckOrMoved,
                    [currentPlayer === "white" ? "black" : "white"]: true,
                  }
                : {
                    ...state.kingCheckOrMoved,
                    [currentPlayer]: true,
                  }
              : state.kingCheckOrMoved,
          rookMoved: {
            ...state.rookMoved,
            [currentPlayer]: {
              left:
                (fromCol === 0 &&
                  fromRow === 0 &&
                  board[fromRow][fromCol] == "r") ||
                (fromCol === 0 &&
                  fromRow === 7 &&
                  board[fromRow][fromCol] == "R") ||
                state.rookMoved[currentPlayer].left,
              right:
                (fromCol === 7 &&
                  fromRow === 0 &&
                  board[fromRow][fromCol] == "r") ||
                (fromCol === 7 &&
                  fromRow === 7 &&
                  board[fromRow][fromCol] == "R") ||
                state.rookMoved[currentPlayer].right,
            },
          },
          currentPlayer: currentPlayer === "white" ? "black" : "white",
          lastMove: { fromRow, fromCol, toRow, toCol },
          isCheckMate:
            fiftyMoves == 50
              ? "draw"
              : isCheckMate(
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
          historyIndex: state.historyIndex + 1,
          fiftyMoveRuleCounter: fiftyMoves,
          numberOfFullMoves:
            currentPlayer == "black"
              ? state.numberOfFullMoves + 1
              : state.numberOfFullMoves,
        };

        playSound(sound);

        setTimeout(() => {
          set(nextState);
          if (computer == nextState.currentPlayer)
            get().computerMove(nextState);
        }, 300);

        get().saveMove(JSON.stringify(nextState));

        return true;
      },

      // Check if the move is valid
      isValidMove: (fromRow, fromCol, toRow, toCol) => {
        const { board, currentPlayer, kingCheckOrMoved, rookMoved } = get();
        if (
          !Number.isInteger(fromRow) ||
          !Number.isInteger(fromCol) ||
          !Number.isInteger(toRow) ||
          !Number.isInteger(toCol)
        )
          return false;

        const newBoard = board.map((row) => [...row]);
        const piece = newBoard[fromRow][fromCol];
        if (!piece) return false;

        const isWhitePiece = piece === piece.toUpperCase();
        if (
          (currentPlayer === "white" && !isWhitePiece) ||
          (currentPlayer === "black" && isWhitePiece)
        )
          return false;

        const temp = isMovePossible(
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

        return temp;
      },

      // Promote Pawn
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

      // Save state of the board
      saveMove: async (nextState: string) => {
        const state = JSON.parse(nextState);
        const db = await getDB();
        const serializedState = JSON.stringify(state);

        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const existingMove = await store.get(state.historyIndex);
        if (existingMove) {
          const allMoves = await store.getAll();
          const movesToDelete = allMoves.filter(
            (move) => move.id >= state.historyIndex
          );
          for (const move of movesToDelete) {
            await store.delete(move.id);
          }
        }

        await store.put({
          id: state.historyIndex,
          state: serializedState,
          timestamp: Date.now(),
        });
      },

      undoMove: async () => {
        const { historyIndex } = get();
        if (historyIndex - 1 < 0) {
          get().refetchStore();
          return;
        }

        const db = await getDB();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);

        const previousMove = await store.get(historyIndex - 1);
        if (!previousMove) return;

        const previousState = JSON.parse(previousMove.state);
        set(previousState);
      },

      redoMove: async () => {
        const { historyIndex } = get();

        const db = await getDB();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);

        const nextMove = await store.get(historyIndex + 1);
        if (!nextMove) return;

        const nextState = JSON.parse(nextMove.state);
        set(nextState);
      },

      computerMove: async (nextState) => {
        const {
          board,
          lastMove,
          rookMoved,
          kingCheckOrMoved,
          fiftyMoveRuleCounter,
          numberOfFullMoves,
          computer,
        } = nextState;
        let compColor = computer;

        if (!computer) compColor = "white";
        const FEN = ConvertBoardToFEN(
          board,
          compColor,
          lastMove,
          rookMoved,
          kingCheckOrMoved,
          numberOfFullMoves,
          fiftyMoveRuleCounter
        );

        const move = await GetBestMove(FEN, get().stockfishLevel);
        const { promotedPiece } = move;

        if (promotedPiece)
          get().promotePawn(move.newX, move.newY, promotedPiece);

        get().movePiece(move.prevX, move.prevY, move.newX, move.newY, true);
      },

      updateComputer: (color: PieceColor | null) => {
        set({ computer: color });
      },

      updateStockfishLevel: (level: number) => {
        set({ stockfishLevel: level });
      },

      refetchStore: () => {
        set({
          board: initialBoard,
          currentPlayer: "white",
          lastMove: null,
          movingPiece: null,
          kingCheckOrMoved: intitialkingCheckOrMoved,
          rookMoved: initialRookMoved,
          isKingInCheck: "noCheck",
          isCheckMate: "noCheckMate",
          eliminatedPieces: { white: [], black: [] },
          historyIndex: -1,
          computer: null,
          fiftyMoveRuleCounter: 0,
          numberOfFullMoves: 1,
        });
      },
    }),
    {
      name: "chess-store",
      getStorage: () => localStorage,
    }
  )
);
