import { createClient } from "redis";

const redisClient = createClient();
redisClient.on("error", (err) => {
  console.error("Redis Client Error");
  console.error(err);
  process.exit(1);
});
(async () => {
  await redisClient.connect();
})();

export default redisClient;
