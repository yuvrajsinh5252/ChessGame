"use server";

import { pusherServer } from "@/lib/pusher";
import { prisma } from "../prisma";

export async function handlePlayerDraw(gameId: string, playerId: string) {
  try {
    const game = await prisma.game.findUnique({ where: { roomId: gameId } });
    if (!game) throw new Error("Game not found");

    const players = await prisma.player.findMany({ where: { gameId } });

    const player = players.find((player) => player.id !== playerId);
    if (!player) throw new Error("Player not found");

    await prisma.player.update({
      where: { id: player.id },
      data: {
        drawRequest: true,
      },
    });

    await pusherServer.trigger(`room-${player.id}`, "draw", { status: "draw" });
    return "Player requested draw";
  } catch (error) {
    return "Error";
  }
}

export async function drawAccepted(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      winner: "draw",
    },
  });

  await prisma.stats.updateMany({
    data: {
      draws: {
        increment: 1,
      },
    },
  });

  await pusherServer.trigger(`room-${gameId}`, "drawAccepted", {
    status: "draw",
  });
  return "Draw accepted";
}

export async function drawDeclined(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  await prisma.player.updateMany({
    where: { gameId },
    data: {
      drawRequest: false,
    },
  });

  await pusherServer.trigger(`room-${gameId}`, "drawDeclined", {
    status: "declined",
  });
  return "Draw declined";
}
