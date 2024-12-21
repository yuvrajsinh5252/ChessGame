import { Board } from "@/store/useChessStore";

export type PieceType = string;
export type PieceColor = "white" | "black";

export interface ChessState {
  board: Board;
  currentPlayer: "white" | "black";
  lastMove: NullableLastMove;
  movingPiece: NullableLastMove;
  kingCheckOrMoved: kingCheckOrMoved;
  rookMoved: rookMoved;
  movePiece: MovePiece;
  isValidMove: ValidState;
  isKingInCheck: "K" | "k" | "noCheck";
  isCheckMate: typeCheckMate;
  eliminatedPieces: { white: PieceType[]; black: PieceType[] };
  canPromotePawn: typePromotePawn;
  computer: PieceColor | null;
  stockfishLevel: number;
  historyIndex: number;
  fiftyMoveRuleCounter: number;
  numberOfFullMoves: number;

  updateComputer: (color: PieceColor | null) => void;
  saveMove: (nextState: string) => void;
  undoMove: () => void;
  redoMove: () => void;
  computerMove: (nextState: any) => void;
  updateStockfishLevel: (level: number) => void;
  promotePawn: (row: number, col: number, newPiece: PieceType) => void;
  refetchStore: () => void;
}

export type typePromotePawn = {
  row: number;
  col: number;
  piece: PieceType | null;
} | null;

export type typeCheckMate =
  | "white"
  | "black"
  | "draw"
  | "noCheckMate"
  | "stalemate";

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
  lastMove: NullableLastMove;
  currentPlayer: PieceColor;
  highlight: boolean;
  setSelectedPiece: any;
  movingPiece: NullableLastMove;
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
    isComputer: boolean
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
