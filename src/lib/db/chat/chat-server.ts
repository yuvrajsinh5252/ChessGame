"use server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function sendMessage(
  roomId: string,
  message: string,
  playerId: string,
  name: string
) {
  try {
    const chatMessage = await prisma.chatMessage.create({
      data: {
        content: message,
        userId: playerId,
        userName: name,
        roomId: roomId,
      },
    });

    await pusherServer.trigger(`${roomId}`, "chat", {
      message,
      playerId,
      name,
      id: chatMessage.id,
      timestamp: chatMessage.createdAt,
    });

    return chatMessage;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send message");
  }
}

export async function getMessages(roomId: string) {
  try {
    return await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
