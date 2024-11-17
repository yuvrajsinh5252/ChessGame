"use server";

import { pusherServer } from "../pusher";
import { prisma } from "./prisma";

export async function JoinGame({ roomId }: { roomId: string }) {
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
      const newPlayer = await prisma.player.create({
        data: {
          gameId: roomId,
          color: room[0].color === "white" ? "black" : "white",
        },
      });

      await prisma.game.update({
        where: { roomId: roomId },
        data: {
          players: {
            connect: { id: newPlayer.id },
          },
        },
      });

      await pusherServer.trigger(`room-${roomId}`, "player-joined", {
        message: "A new player has joined the room",
      });

      return { playerId: newPlayer.id };
    }
  } catch (error) {
    return "Error";
  }
}
