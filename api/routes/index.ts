import mongoose from 'mongoose';
import express from 'express';
import rateLimit from 'express-rate-limit';
import routeUsers from './routeUsers.ts';
import routeTasks from './routeTasks.ts';
import env from '../helper/env.ts';
const router = express.Router();

// Use validated environment variables and fallback to local Mongo when not provided.
const db = env.MONGO_URL || 'mongodb://localhost:27017/users';
mongoose.Promise = global.Promise;

// Helper to connect with retries and exponential backoff.
async function connectWithRetry(uri: string, maxAttempts = 5) {
  let attempt = 0;
  const baseDelay = 1000; // 1s
  while (attempt < maxAttempts) {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB connected');
      return;
    } catch (err: any) {
      attempt += 1;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.error(`Mongo connect attempt ${attempt} failed:`, err.message || err);
      if (attempt >= maxAttempts) {
        console.error('Max Mongo connect attempts reached. Exiting.');
        process.exit(1);
      }
      // Wait before retrying
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

connectWithRetry(db).catch((err) => {
  console.error('Unexpected error connecting to MongoDB', err);
  process.exit(1);
});

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later."
});

router.use('/users', routeUsers);
router.use('/tasks', limiter, routeTasks);

export default router;