import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_CONNECTIONURL);

export default redis;