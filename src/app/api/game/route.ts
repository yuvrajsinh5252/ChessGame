import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const { data, roomId } = await req.json();

  pusherServer.trigger(roomId, "incoming-message", data);

  return new Response(JSON.stringify({ success: true }));
}
