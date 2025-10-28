import { createClient } from "redis";

// Prefer an environment variable so Docker / other runtimes can control where Redis lives.
// Fallback to localhost for local development.
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const client = createClient({
    url: redisUrl,
});

client.on('error', (err: any) => {
    console.error('Redis Client Error', err);
});

client.on('connect', () => {
    console.log('Connected to Redis:', redisUrl);
});

(async () => {
    try {
        await client.connect();
    } catch (err) {
        // If connect fails early, log the error but don't crash the process here.
        console.error('Redis connect failed:', err);
    }
})();

export default client;