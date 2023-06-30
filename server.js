// Import required modules
const express = require('express');
const router = require('./routes/index');

const app = express(); // Create an Express app
const port = parseInt(process.env.PORT, 10) || 5000; // Set the port

app.use(express.json()); // Middleware to parse JSON requests
app.use('/', router); // Use the router for routing

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export the app
module.exports = app;
