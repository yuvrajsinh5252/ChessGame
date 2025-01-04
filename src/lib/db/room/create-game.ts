"use server";

import { prisma } from "@/lib/prisma";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "@/utils/initialSetup";

export async function CreateRoom(playerId: string) {
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

  await prisma.player.create({
    data: {
      id: playerId,
      color: "white",
      game: {
        connect: { roomId: createdRoom.roomId },
      },
    },
  });

  return { roomId: createdRoom.roomId };
}
