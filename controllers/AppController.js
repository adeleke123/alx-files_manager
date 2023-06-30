const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  // Method to get the status of the Redis and database connections
  static getStatus(request, response) {
    // Check if Redis and database connections are alive
    response.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  // Method to get the number of users and files in the database
  static async getStats(request, response) {
    // Get the number of users from the database
    const usersNum = await dbClient.nbUsers();

    // Get the number of files from the database
    const filesNum = await dbClient.nbFiles();

    // Send the number of users and files as a JSON response
    response.status(200).json({ users: usersNum, files: filesNum });
  }
}

module.exports = AppController;
