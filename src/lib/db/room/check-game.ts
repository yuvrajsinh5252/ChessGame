"use server";

import { prisma } from "@/lib/prisma";

export async function CheckGame(playerId: string) {
  const game = await prisma.game.findFirst({
    where: {
      players: {
        some: {
          id: playerId,
        },
      },
    },
    include: {
      players: true,
    },
  });

  return game;
}
