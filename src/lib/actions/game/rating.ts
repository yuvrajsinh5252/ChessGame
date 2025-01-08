"use server";

import { prisma } from "@/lib/prisma";

const K_FACTOR = 32; // Standard K-factor for chess ratings

function calculateExpectedScore(
  playerRating: number,
  opponentRating: number
): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

function calculateNewRating(
  currentRating: number,
  expectedScore: number,
  actualScore: number
): number {
  return Math.round(currentRating + K_FACTOR * (actualScore - expectedScore));
}

export async function updateGameResults(
  winnerId: string | null,
  player1Id: string,
  player2Id: string,
  isDraw: boolean = false,
  gameId: string
) {
  // Get both players' stats in one query
  const [player1Stats, player2Stats] = await Promise.all([
    prisma.userStats.findUnique({ where: { userId: player1Id } }),
    prisma.userStats.findUnique({ where: { userId: player2Id } }),
  ]);

  const player1Rating = player1Stats?.rating || 1200;
  const player2Rating = player2Stats?.rating || 1200;

  const player1Expected = calculateExpectedScore(player1Rating, player2Rating);
  const player2Expected = calculateExpectedScore(player2Rating, player1Rating);

  let player1ActualScore = isDraw ? 0.5 : winnerId === player1Id ? 1 : 0;
  let player2ActualScore = isDraw ? 0.5 : winnerId === player2Id ? 1 : 0;

  const player1NewRating = calculateNewRating(
    player1Rating,
    player1Expected,
    player1ActualScore
  );
  const player2NewRating = calculateNewRating(
    player2Rating,
    player2Expected,
    player2ActualScore
  );

  // Get game details for history
  const game = await prisma.game.findUnique({
    where: { roomId: gameId },
    include: { players: true },
  });

  if (!game) throw new Error("Game not found");

  const player1Color =
    game.players.find((p) => p.id === player1Id)?.color || "white";
  const player2Color =
    game.players.find((p) => p.id === player2Id)?.color || "black";

  // Update everything in a single transaction
  await prisma.$transaction([
    // Create game history records for both players
    prisma.gameHistory.create({
      data: {
        playerId: player1Id,
        playerColor: player1Color,
        opponentId: player2Id,
        result: isDraw
          ? "draw"
          : winnerId === player1Id
          ? player1Color
          : player2Color,
      },
    }),
    prisma.gameHistory.create({
      data: {
        playerId: player2Id,
        playerColor: player2Color,
        opponentId: player1Id,
        result: isDraw
          ? "draw"
          : winnerId === player2Id
          ? player2Color
          : player1Color,
      },
    }),
    // Update player1 stats
    prisma.userStats.upsert({
      where: { userId: player1Id },
      create: {
        userId: player1Id,
        rating: player1NewRating,
        gamesPlayed: 1,
        wins: player1ActualScore === 1 ? 1 : 0,
        losses: player1ActualScore === 0 ? 1 : 0,
        draws: isDraw ? 1 : 0,
        winStreak: player1ActualScore === 1 ? 1 : 0,
        bestRating: player1NewRating,
      },
      update: {
        rating: player1NewRating,
        gamesPlayed: { increment: 1 },
        wins: { increment: player1ActualScore === 1 ? 1 : 0 },
        losses: { increment: player1ActualScore === 0 ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        winStreak: {
          set:
            player1ActualScore === 1 ? (player1Stats?.winStreak || 0) + 1 : 0,
        },
        bestRating: {
          set: Math.max(player1NewRating, player1Stats?.bestRating || 1200),
        },
      },
    }),
    // Update player2 stats
    prisma.userStats.upsert({
      where: { userId: player2Id },
      create: {
        userId: player2Id,
        rating: player2NewRating,
        gamesPlayed: 1,
        wins: player2ActualScore === 1 ? 1 : 0,
        losses: player2ActualScore === 0 ? 1 : 0,
        draws: isDraw ? 1 : 0,
        winStreak: player2ActualScore === 1 ? 1 : 0,
        bestRating: player2NewRating,
      },
      update: {
        rating: player2NewRating,
        gamesPlayed: { increment: 1 },
        wins: { increment: player2ActualScore === 1 ? 1 : 0 },
        losses: { increment: player2ActualScore === 0 ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        winStreak: {
          set:
            player2ActualScore === 1 ? (player2Stats?.winStreak || 0) + 1 : 0,
        },
        bestRating: {
          set: Math.max(player2NewRating, player2Stats?.bestRating || 1200),
        },
      },
    }),
  ]);

  return {
    player1NewRating,
    player2NewRating,
    ratingChange1: player1NewRating - player1Rating,
    ratingChange2: player2NewRating - player2Rating,
  };
}
