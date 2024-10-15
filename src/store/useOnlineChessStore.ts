import { OnlineChessStore } from "@/types/onlineChess";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";
import { create } from "zustand";

const useOnlineChessStore = create<OnlineChessStore>((set) => ({
  players: [],
  winner: "in-progress",
  gameState: {
    board: initialBoard,
    currentPlayer: "white",
    status: "waiting",
    lastMove: null,
    eliminatedPieces: { white: [], black: [] },
    kingCheckOrMoved: intitialkingCheckOrMoved,
    rookMoved: initialRookMoved,
    isKingInCheck: "noCheck",
  },
}));

export default useOnlineChessStore;
