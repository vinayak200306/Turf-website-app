import Redis from "ioredis";
import { env } from "./env.js";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 2
});

export default redis;
