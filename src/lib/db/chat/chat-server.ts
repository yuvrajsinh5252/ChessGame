"use server";
import { pusherServer } from "@/lib/pusher";

export async function sendMessage(
  roomId: string,
  message: string,
  playerId: string
) {
  try {
    await pusherServer.trigger(`${roomId}`, "chat", { message, playerId });
  } catch (error) {
    console.error(error);
  }
}
