import { prisma } from "@/lib/db/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const { data, roomId } = await req.json();

  pusherServer.trigger(roomId, "incoming-message", data);

  // await prisma..create({
  //   data: {
  //     text,
  //     chatRoomId: roomId,
  //   },
  // });

  return new Response(JSON.stringify({ success: true }));
}
