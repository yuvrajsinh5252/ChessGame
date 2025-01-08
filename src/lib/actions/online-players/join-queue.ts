"use server";

import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { createGame } from "../room/crud-game";

const QUEUE_KEY = "matchmaking_queue";

export async function joinQueue(queueId: string) {
  try {
    const existing = await redis.zscore(QUEUE_KEY, queueId);
    if (existing) {
      return { success: false, error: "Already in queue" };
    }

    await redis.zadd(QUEUE_KEY, {
      score: Date.now(),
      member: queueId,
    });

    const queueMembers = await redis.zrange(QUEUE_KEY, 0, -1);
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

        await pusherServer.trigger(
          [`user-${queueId}`, `user-${opponent}`],
          "match-found",
          {
            player1: queueId,
            player2: opponent,
            roomId: game.roomId,
          }
        );

        return { success: true, matched: true };
      }
    }

    return { success: true, matched: false };
  } catch (error) {
    await redis.zrem(QUEUE_KEY, queueId);
    return { success: false, error };
  }
}
