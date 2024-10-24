
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Get the Mongo URI from environment variables
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    // Connect to MongoDB without deprecated options
    await mongoose.connect(mongoURI);

    const db = mongoose.connection;

    db.on('error', (error) => {
      console.error('Mongo connection error:', error);
    });

    db.once('open', () => {
      console.log('Connected to Mongo');
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

module.exports = connectToMongo;
