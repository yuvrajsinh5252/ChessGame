import { Board } from "@/store/useChessStore";
import { kingCheckOrMoved, NullableLastMove, rookMoved } from "./chess";

export interface Player {
  id: string;
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
  isKingInCheck: "noCheck" | "white" | "black";
}

export interface OnlineChessStore {
  players: Player[];
  gameState: GameState;
}
