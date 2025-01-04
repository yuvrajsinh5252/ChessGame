import { prisma } from "@/lib/prisma";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";

export async function createGame(player1: string, player2: string) {
  const game = await prisma.game.create({
    data: {
      board: JSON.stringify(initialBoard),
      currentPlayer: "white",
      lastMove: JSON.stringify({}),
      eliminatedPiece: JSON.stringify({ white: [], black: [] }),
      kingCheckOrMoved: JSON.stringify(intitialkingCheckOrMoved),
      rookMoved: JSON.stringify(initialRookMoved),
      canPawnPromote: JSON.stringify({}),
      isKingInCheck: "noCheck",
      players: {
        create: [
          {
            id: player1,
            color: "white",
          },
          {
            id: player2,
            color: "black",
          },
        ],
      },
    },
  });

  return game;
}
