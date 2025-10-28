import { z } from 'zod';
// Load .env for local development if present. This will be ignored in production images.
// eslint-disable-next-line @typescript-eslint/no-var-requires
try { require('dotenv').config(); } catch (e) { /* dotenv not installed or no .env file — ok */ }

const rawSchema = z.object({
  NODE_ENV: z.string().optional(),
  MONGO_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  PORT: z.string().optional(),
});

const parsed = rawSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Environment validation error:', parsed.error.format());
  process.exit(1);
}

const env = {
  NODE_ENV: parsed.data.NODE_ENV || 'development',
  MONGO_URL: parsed.data.MONGO_URL, // optional — caller may provide a fallback
  REDIS_URL: parsed.data.REDIS_URL,
  PORT: parsed.data.PORT ? Number(parsed.data.PORT) : 3000,
};

export default env;
