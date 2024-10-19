import { prisma } from "@/lib/db/prisma";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";

export async function GET() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  await prisma.player.deleteMany({
    where: {
      game: {
        createdAt: {
          lt: fifteenMinutesAgo,
        },
      },
    },
  });

  await prisma.game.deleteMany({
    where: {
      createdAt: {
        lt: fifteenMinutesAgo,
      },
    },
  });

  const createdRoom = await prisma.game.create({
    data: {
      board: JSON.stringify(initialBoard),
      currentPlayer: "white",
      lastMove: JSON.stringify({}),
      eliminatedPiece: JSON.stringify({ white: [], black: [] }),
      kingCheckOrMoved: JSON.stringify(intitialkingCheckOrMoved),
      rookMoved: JSON.stringify(initialRookMoved),
      canPawnPromote: JSON.stringify({}),
    },
  });

  const player = await prisma.player.create({
    data: {
      color: "white",
      game: {
        connect: { roomId: createdRoom.roomId },
      },
    },
  });

  return new Response(
    JSON.stringify({ roomId: createdRoom.roomId, playerId: player.id }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
