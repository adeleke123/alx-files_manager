// Import required module
const { MongoClient } = require('mongodb');

// Set up MongoDB connection details
const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';

const url = `mongodb://${HOST}:${PORT}`;

// Define the DBClient class
class DBClient {
  constructor() {
    // Create a MongoClient instance
    this.client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });

    // Connect to the MongoDB server and initialize the database
    this.client.connect().then(() => {
      this.db = this.client.db(`${DATABASE}`);
    }).catch((err) => {
      console.log(err);
    });
  }

  // Check if the MongoDB connection is alive
  isAlive() {
    return this.client.isConnected();
  }

  // Get the number of users in the database
  async nbUsers() {
    const users = this.db.collection('users');
    const usersNum = await users.countDocuments();
    return usersNum;
  }

  // Get the number of files in the database
  async nbFiles() {
    const files = this.db.collection('files');
    const filesNum = await files.countDocuments();
    return filesNum;
  }
}

// Create a new instance of DBClient
const dbClient = new DBClient();

// Export the dbClient instance
module.exports = dbClient;
