const redis = require("redis");
require("dotenv").config();

// Create a Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

// Handle Redis errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();

module.exports = redisClient;
