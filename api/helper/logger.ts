import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors, json } = format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  // If error stack is present, include it
  const base = { level, message, timestamp, ...meta } as any;
  if (stack) base.stack = stack;
  return JSON.stringify(base);
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [new transports.Console()],
});

export default logger;
