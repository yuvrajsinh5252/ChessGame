"use server";

import { pusherServer } from "@/lib/pusher";
import { prisma } from "../../prisma";

export async function JoinGame({
  roomId,
  playerId,
}: {
  roomId: string;
  playerId: string;
}) {
  try {
    if (!roomId) throw new Error("Room ID is required");

    const room = await prisma.player.findMany({
      where: {
        gameId: roomId,
      },
    });

    if (room.length === 2) throw new Error("Room is full");
    if (room.length === 0) throw new Error("Room not found");
    if (room.length === 1) {
      const existingPlayer = await prisma.player.findUnique({
        where: { id: playerId },
      });

      if (existingPlayer) throw new Error("Player already exists in a game");

      await prisma.player.create({
        data: {
          id: playerId,
          gameId: roomId,
          color: room[0].color === "white" ? "black" : "white",
        },
      });

      await prisma.game.update({
        where: { roomId: roomId },
        data: {
          players: {
            connect: { id: playerId },
          },
        },
      });

      await pusherServer.trigger(`room-${roomId}`, "player-joined", {
        message: "A new player has joined the room",
      });

      return { success: true };
    }
  } catch (error) {
    return "Error";
  }
}
