import { config as loadEnv } from 'dotenv';
loadEnv();
export const CONFIG = {
  port: getPort(),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  wordQuota: parseInt(process.env.DAILY_WORD_QUOTA ?? '80000', 10) || 80000,
  logLevel: process.env.LOG_LEVEL || 'debug',
};

function getPort(): number {
  const port = parseInt(process.env.PORT || '3000', 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}`);
  }
  return port;
}
