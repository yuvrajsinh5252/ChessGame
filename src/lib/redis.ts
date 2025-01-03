import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function testRedisConnection() {
  try {
    await redis.ping();
    console.log("Redis connection successful!");
    return true;
  } catch (error) {
    console.error("Redis connection failed:", error);
    return false;
  }
}
