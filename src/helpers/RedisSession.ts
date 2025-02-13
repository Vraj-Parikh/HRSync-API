import ms from "ms";
import redisClient from "../model/redis/redisClient";
import { TSessionRedis } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import env_parsed from "../env";

export async function createRedisSession(redisJson: TSessionRedis) {
  const sessionId = uuidv4();
  await redisClient.json.set(`session:${sessionId}`, "$", redisJson);
  await redisClient.expire(
    `session:${sessionId}`,
    ms(env_parsed.JWT_REFRESH_TOKEN_EXPIRY)
  );
  return sessionId;
}
