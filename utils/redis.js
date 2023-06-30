// Import required modules
const { createClient } = require('redis');
const { promisify } = require('util');

// Class to define methods for commonly used Redis commands
class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  // Check connection status and report
  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  // Get value for a given key from the Redis server
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  // Set key-value pair to the Redis server
  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, time);
  }

  // Delete key-value pair from the Redis server
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

// Create an instance of RedisClient
const redisClient = new RedisClient();

// Export the RedisClient instance
module.exports = redisClient;
