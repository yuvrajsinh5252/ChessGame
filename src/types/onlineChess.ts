import { Board } from "@/store/useChessStore";
import {
  kingCheckOrMoved,
  MovePiece,
  NullableLastMove,
  PieceType,
  rookMoved,
  typePromotePawn,
  ValidState,
} from "./chess";

export interface Player {
  id: string;
  gameId?: string;
  name?: string;
  color: "white" | "black";
}

export interface GameState {
  board: Board;
  currentPlayer: "white" | "black";
  winner: winner;
  status: "waiting" | "in-progress" | "finished";
  lastMove: NullableLastMove;
  eliminatedPieces: {
    white: string[];
    black: string[];
  };
  kingCheckOrMoved: kingCheckOrMoved;
  rookMoved: rookMoved;
  isKingInCheck: "noCheck" | "K" | "k";
  canPromotePawn: typePromotePawn;
}

export interface OnlineChessStore {
  players: Player[];
  gameState: GameState;
}

export type winner = "white" | "black" | "draw" | "none";

export interface OnlineChessStoreActions {
  updateGameState: (gameState: Partial<GameState>) => void;
  updatePlayersState: (players: Player[]) => void;
  promotePawn: (row: number, col: number, newPiece: PieceType) => void;
  movePiece: MovePiece;
  isValidMove: ValidState;
}

export interface OnlinePiece {
  type: string;
  position: { row: number; col: number };
  lastMove: NullableLastMove;
  highlight: boolean;
  currentPlayer: "white" | "black";
  setSelectedPiece: React.Dispatch<
    React.SetStateAction<{ row: number; col: number } | null>
  >;
  playerColor: "white" | "black";
}
