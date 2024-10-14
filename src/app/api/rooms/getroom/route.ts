import { prisma } from "@/lib/db/prisma";
import { pusherServer } from "@/lib/pusher";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { roomId } = await req.json();

  if (!roomId) return new Response("Room ID is required", { status: 400 });

  const room = await prisma.player.findMany({
    where: {
      gameId: roomId,
    },
  });

  if (room.length === 2) return new Response("Room is full", { status: 400 });
  if (room.length === 0) return new Response("Room not found", { status: 404 });
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

    return new Response("Room found connecting...", { status: 200 });
  }
}
