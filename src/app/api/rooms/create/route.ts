import { prisma } from "@/lib/db/prisma";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";

export async function GET() {
  const createdRoom = await prisma.game.create({
    data: {
      board: JSON.stringify(initialBoard),
      currentPlayer: "white",
      lastMove: JSON.stringify({}),
      eliminatedPiece: JSON.stringify({}),
      kingCheckOrMoved: JSON.stringify(intitialkingCheckOrMoved),
      rookMoved: JSON.stringify(initialRookMoved),
      players: [1],
    },
  });

  return new Response(createdRoom.roomId);
}