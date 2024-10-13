import { prisma } from "@/lib/db/prisma";

export async function GET(roomId: string) {
  const game = await prisma.game.findUnique({
    where: {
      roomId: roomId,
    },
  });

  if (game === null) return new Response("Room not found", { status: 404 });
  else if (game.players.length == 1)
    return new Response("you can connect", { status: 200 });
  else return new Response("Room is full", { status: 400 });
}
