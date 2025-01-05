"use server";

import { prisma } from "@/lib/prisma";

const K_FACTOR = 32; // ELO rating constant

export async function calculateNewRating(
  winnerRating: number,
  loserRating: number
) {
  const expectedScore =
    1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const ratingChange = Math.round(K_FACTOR * (1 - expectedScore));
  return {
    winnerNewRating: winnerRating + ratingChange,
    loserNewRating: loserRating - ratingChange,
  };
}

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
