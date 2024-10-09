import { Board } from "@/store/useChessStore";

export type PieceType = string;
export type PieceColor = "white" | "black";

export interface ChessState {
  board: Board;
  currentPlayer: "white" | "black";
  lastMove: NullableLastMove;
  kingCheckOrMoved: kingCheckOrMoved;
  rookMoved: rookMoved;
  movePiece: MovePiece;
  isValidMove: ValidState;
  isKingInCheck: "K" | "k" | "noCheck";
  isCheckMate: typeCheckMate;
}

export type typeCheckMate = "white" | "black" | "draw" | "noCheckMate";

export type kingCheckOrMoved = {
  white: boolean;
  black: boolean;
};

export type rookMoved = {
  white: { left: boolean; right: boolean };
  black: { left: boolean; right: boolean };
};

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
  (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    checking: false
  ): boolean;
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
