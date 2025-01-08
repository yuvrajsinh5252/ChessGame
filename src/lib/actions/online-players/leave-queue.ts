"use server";

import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";

const QUEUE_KEY = "matchmaking_queue";

export async function leaveQueue(queueId: string) {
  try {
    await redis.zrem(QUEUE_KEY, queueId);
    await pusherServer.trigger("queue", "player-left", {
      playerId: queueId,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function ClearQueue() {
  try {
    await redis.del(QUEUE_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
