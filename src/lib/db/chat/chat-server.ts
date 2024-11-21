"use server";
import { pusherServer } from "@/lib/pusher";

export async function sendMessage(roomId: string, message: string) {
  try {
    await pusherServer.trigger(`${roomId}`, "chat", message);
  } catch (error) {
    console.error(error);
  }
}
