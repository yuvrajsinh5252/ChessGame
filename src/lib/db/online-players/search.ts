"use server";

import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { createGame } from "../room/create-global-game";

const QUEUE_KEY = "matchmaking_queue";
const MATCH_TTL = 60;

export async function joinQueue(queueId: string) {
  console.log("joinQueue", queueId);
  try {
    await cleanQueue();

    // Check if player is already in queue
    const existing = await redis.zscore(QUEUE_KEY, queueId);
    if (existing) {
      return { success: false, error: "Already in queue" };
    }

    // Add to queue with current timestamp
    await redis.zadd(QUEUE_KEY, {
      score: Date.now(),
      member: queueId,
    });

    // Get queue members excluding stale entries
    const currentTime = Date.now();
    const validTime = currentTime - MATCH_TTL * 1000;
    const queueMembers = await redis.zrange(QUEUE_KEY, validTime, "+inf", {
      byScore: true,
    });

    console.log("queueMembers", queueMembers);

    const availableOpponents = queueMembers.filter((id) => id !== queueId);

    if (availableOpponents.length > 0) {
      const opponent = String(
        availableOpponents[
          Math.floor(Math.random() * availableOpponents.length)
        ]
      );

      const multi = redis.multi();
      multi.zrem(QUEUE_KEY, queueId, opponent);
      const result = await multi.exec();

      if (result) {
        let game;
        try {
          game = await createGame(queueId, opponent);
        } catch (error) {
          return { success: false, error };
        }

        const res = await pusherServer.trigger(
          [`user-${queueId}`, `user-${opponent}`],
          "match-found",
          {
            player1: queueId,
            player2: opponent,
            roomId: game.roomId,
          }
        );

        console.log("pusher response", res);

        return { success: true, matched: true };
      }
    }

    return { success: true, matched: false };
  } catch (error) {
    await redis.zrem(QUEUE_KEY, queueId);
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
  const staleMembers = await redis.zrange(QUEUE_KEY, 0, staleTimeout, {
    byScore: true,
  });

  if (staleMembers.length > 0) {
    await redis.zremrangebyscore(QUEUE_KEY, 0, staleTimeout);
    // Notify removed players
    for (const memberId of staleMembers) {
      await pusherServer.trigger(`user-${memberId}`, "queue-timeout", {
        message: "Queue timeout - please rejoin",
      });
    }
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
