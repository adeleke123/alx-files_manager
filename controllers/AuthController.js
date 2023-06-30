const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AuthController {
  static async getConnect(request, response) {
    // Extract user email from Authorization header
    const authData = request.header('Authorization');
    let userEmail = authData.split(' ')[1];
    const buff = Buffer.from(userEmail, 'base64');
    userEmail = buff.toString('ascii');

    // Split email and password
    const data = userEmail.split(':'); // contains email and password

    // Check if email and password are present
    if (data.length !== 2) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Hash the password
    const hashedPassword = sha1(data[1]);

    // Access the "users" collection in the database
    const users = dbClient.db.collection('users');

    // Find the user with matching email and hashed password
    users.findOne({ email: data[0], password: hashedPassword }, async (err, user) => {
      if (user) {
        // Generate a unique token
        const token = uuidv4();

        // Set the token as a key in Redis with the user ID as the value
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24);

        // Return the token in the response
        response.status(200).json({ token });
      } else {
        response.status(401).json({ error: 'Unauthorized' });
      }
    });
  }

  static async getDisconnect(request, response) {
    // Get the token from X-Token header
    const token = request.header('X-Token');

    // Construct the key for Redis lookup
    const key = `auth_${token}`;

    // Get the user ID associated with the token from Redis
    const id = await redisClient.get(key);

    if (id) {
      // If the token exists, delete it from Redis
      await redisClient.del(key);
      response.status(204).json({});
    } else {
      response.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = AuthController;
