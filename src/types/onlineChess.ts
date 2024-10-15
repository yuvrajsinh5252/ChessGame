import { Board } from "@/store/useChessStore";
import {
  kingCheckOrMoved,
  MovePiece,
  NullableLastMove,
  rookMoved,
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
  status: "waiting" | "in-progress" | "finished";
  lastMove: NullableLastMove;
  eliminatedPieces: {
    white: string[];
    black: string[];
  };
  kingCheckOrMoved: kingCheckOrMoved;
  rookMoved: rookMoved;
  isKingInCheck: "noCheck" | "K" | "k";
}

export interface OnlineChessStore {
  players: Player[];
  gameState: GameState;
}

export interface OnlineChessStoreActions {
  updateGameState: (gameState: Partial<GameState>) => void;
  updatePlayersState: (players: Player[]) => void;
  movePiece: MovePiece;
  isValidMove: ValidState;
}
