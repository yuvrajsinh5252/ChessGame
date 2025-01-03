"use server";

import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";
import { prisma } from "../../prisma";

export async function CreateRoom() {
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

  // TODO: Add more stats here, like currentOnlinePlayers etc.
  const existingStats = await prisma.stats.findFirst();
  if (!existingStats) {
    await prisma.stats.create({
      data: {
        totalGames: 1,
      },
    });
  } else {
    await prisma.stats.update({
      where: { id: existingStats.id },
      data: {
        totalGames: existingStats.totalGames + 1,
      },
    });
  }

  return { roomId: createdRoom.roomId, playerId: player.id };
}
