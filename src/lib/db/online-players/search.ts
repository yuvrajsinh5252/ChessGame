"use server";

import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";

const QUEUE_KEY = "matchmaking_queue";
const MATCH_TTL = 60;

export async function joinQueue(queueId: string) {
  try {
    await redis.zadd(QUEUE_KEY, {
      score: Date.now(),
      member: queueId,
    });

    const queueMembers = await redis.zrange(QUEUE_KEY, 0, -1);
    const availableOpponents = queueMembers.filter((id) => id !== queueId);
    const opponent =
      availableOpponents[Math.floor(Math.random() * availableOpponents.length)];

    if (opponent && typeof opponent === "string") {
      const roomId = crypto.randomUUID();
      const player1 = queueId;
      const player2 = opponent;

      await redis.zrem(QUEUE_KEY, player1, player2);

      await pusherServer.trigger(
        [`user-${player1}`, `user-${player2}`],
        "match-found",
        {
          player1,
          player2,
          roomId,
        }
      );
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

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

export async function cleanQueue() {
  const staleTimeout = Date.now() - MATCH_TTL * 1000;
  await redis.zremrangebyscore(QUEUE_KEY, 0, staleTimeout);
}

export async function ClearQueue() {
  try {
    await redis.del(QUEUE_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
