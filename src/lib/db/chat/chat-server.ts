"use server";
import { pusherServer } from "@/lib/pusher";

export async function sendMessage(
  roomId: string,
  message: string,
  playerId: string,
  name: string
) {
  try {
    await pusherServer.trigger(`${roomId}`, "chat", {
      message,
      playerId,
      name,
    });
  } catch (error) {
    console.error(error);
  }
}
