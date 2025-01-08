"use server";

import { prisma } from "@/lib/prisma";

export async function updateUserStats(
  userId: string,
  gameResult: "win" | "loss" | "draw"
) {
  const userStats = await prisma.userStats.findUnique({
    where: { userId },
  });

  if (!userStats) {
    return await prisma.userStats.create({
      data: {
        userId,
        wins: gameResult === "win" ? 1 : 0,
        losses: gameResult === "loss" ? 1 : 0,
        draws: gameResult === "draw" ? 1 : 0,
        gamesPlayed: 1,
        winStreak: gameResult === "win" ? 1 : 0,
      },
    });
  }

  // Creating the gameHistory record
  const player = await prisma.player.findFirst({
    where: { id: userId },
    include: {
      game: {
        include: {
          players: true,
        },
      },
    },
  });

  if (player && player.game) {
    const opponent = player.game.players.find((p) => p.id !== userId);
    if (opponent) {
      await prisma.gameHistory.create({
        data: {
          playerId: userId,
          playerColor: player.color,
          opponentId: opponent.id,
          result:
            gameResult === "win"
              ? player.color
              : gameResult === "loss"
              ? opponent.color
              : "draw",
        },
      });
    }
  }

  return await prisma.userStats.update({
    where: { userId },
    data: {
      wins: gameResult === "win" ? { increment: 1 } : undefined,
      losses: gameResult === "loss" ? { increment: 1 } : undefined,
      draws: gameResult === "draw" ? { increment: 1 } : undefined,
      gamesPlayed: { increment: 1 },
      winStreak:
        gameResult === "win"
          ? { increment: 1 }
          : gameResult === "loss"
          ? 0
          : undefined,
      bestRating: {
        set: Math.max(userStats.bestRating, userStats.rating),
      },
    },
  });
}
