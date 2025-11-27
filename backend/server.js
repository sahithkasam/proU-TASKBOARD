// server.js
// Entry point: loads environment variables, connects DB, starts Express app
import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    const server = createServer(app);
    server.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
