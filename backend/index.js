const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5010;

// Connect to MongoDB and log status
connectToMongo().then(() => {
  console.log('MongoDB connection established successfully');
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
});

// Serve static files from the React frontend
const buildpath = path.join(__dirname, "../client/build");
app.use(express.static(buildpath));

// Enable CORS
app.use(cors({ origin: '*' }));

// Middleware for parsing JSON bodies
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/candidate', require('./routes/candidate'));

// Start server and log when it's running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});