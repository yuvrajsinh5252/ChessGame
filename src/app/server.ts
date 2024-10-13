"use server";

import { prisma } from "@/lib/db/prisma";
import { initialBoard } from "@/utils/initialSetup";

export async function intital() {
  await prisma.game.create({
    data: {
      id: 1,
      board: JSON.stringify(initialBoard),
      currentPlayer: "white",
    },
  });
}
