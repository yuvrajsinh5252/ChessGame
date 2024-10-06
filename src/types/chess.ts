export type PieceType = string;
export type PieceColor = "white" | "black";

export interface Piece {
  type: PieceType;
  position: { row: number; col: number };
}

export interface ChessState {
  board: (Piece | null)[][];
  currentPlayer: PieceColor;
  selectedPiece: { row: number; col: number; piece: Piece | null } | null;
  initializeGame: () => void;
  selectPiece: (row: number, col: number) => void;
  movePiece: (toRow: number, toCol: number) => void;
}
