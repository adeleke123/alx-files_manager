// Importing required modules
const sha1 = require('sha1');
const { ObjectID } = require('mongodb');
const Queue = require('bull');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

// Creating a new queue instance
const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  // Handles the creation of a new user
  static postNew(request, response) {
    const { email, password } = request.body;

    // Checking for missing email and password
    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      return;
    }

    const users = dbClient.db.collection('users');
    users.findOne({ email }, (err, user) => {
      if (user) {
        response.status(400).json({ error: 'Already exist' });
      } else {
        const hashedPassword = sha1(password);
        users
          .insertOne({
            email,
            password: hashedPassword,
          })
          .then((result) => {
            response.status(201).json({ id: result.insertedId, email });
            userQueue.add({ userId: result.insertedId });
          })
          .catch((error) => console.log(error));
      }
    });
  }

  // Retrieves the details of the authenticated user
  static async getMe(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (userId) {
      const users = dbClient.db.collection('users');
      const idObject = new ObjectID(userId);
      users.findOne({ _id: idObject }, (err, user) => {
        if (user) {
          response.status(200).json({ id: userId, email: user.email });
        } else {
          response.status(401).json({ error: 'Unauthorized' });
        }
      });
    } else {
      console.log('Hupatikani!');
      response.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = UsersController;
