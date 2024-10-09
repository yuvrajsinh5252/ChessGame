import { ChessState } from "@/types/chess";
import { CheckCastling } from "@/utils/castle";
import { CheckEnpassant } from "@/utils/enpassant";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";
import { isCheckMate, isKingInCheck } from "@/utils/kingCheck";
import { isMoveValid } from "@/utils/validMove";
import { create } from "zustand";

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

    // check for enpassant
    if (
      lastMove &&
      CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, lastMove)
    )
      newBoard[lastMove.toRow][lastMove.toCol] = null;

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
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (currentPlayer === "white" && !isWhitePiece) ||
      (currentPlayer === "black" && isWhitePiece)
    )
      return false;

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
  isCheckMate: "noCheckMate",
}));
