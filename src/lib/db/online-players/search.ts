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
    const opponent = queueMembers.find((id) => id !== queueId);

    if (opponent && typeof opponent === "string") {
      const result = await matchPlayers(queueId, opponent);
      if (result.success) {
        await redis.zrem(QUEUE_KEY, queueId, opponent);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function matchPlayers(player1: string, player2: string) {
  try {
    const roomId = Math.random().toString(36).substring(7);

    await redis.setex(
      `match:${roomId}`,
      MATCH_TTL,
      JSON.stringify({
        player1,
        player2,
        startTime: Date.now(),
      })
    );

    await pusherServer.trigger("queue", "match-found", {
      player1,
      player2,
      roomId,
    });

    return { success: true, roomId };
  } catch (error) {
    console.error("Match players error:", error);
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

// New function to clean stale queue entries
export async function cleanQueue() {
  const staleTimeout = Date.now() - MATCH_TTL * 1000;
  await redis.zremrangebyscore(QUEUE_KEY, 0, staleTimeout);
}
