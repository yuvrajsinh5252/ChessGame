import { Board } from "@/store/useChessStore";

export type PieceType = string;
export type PieceColor = "white" | "black";

export interface ChessState {
  board: Board;
  currentPlayer: "white" | "black";
  lastMove: NullableLastMove;
  movePiece: MovePiece;
  isValidMove: ValidState;
  isKingInCheck: "K" | "k" | "noCheck";
  isCheckMate: IsCheckMate;
}

interface IsCheckMate {
  (player: "white" | "black"): boolean;
}

export interface IsMoveValid {
  (
    board: Board,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean;
}

export interface Piece {
  type: PieceType | null;
  position: { row: number; col: number };
  highlight: boolean;
}

export interface ValidState {
  (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean;
}

export interface MovePiece {
  (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean;
}

export interface lastMove {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

interface LastMove {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

export type NullableLastMove = LastMove | null;
