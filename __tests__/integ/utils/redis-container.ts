import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';

let redisContainer: StartedRedisContainer | null = null;

export async function startRedisContainer(): Promise<StartedRedisContainer> {
  if (redisContainer) {
    return redisContainer;
  }

  redisContainer = await new RedisContainer('redis:7')
    .withExposedPorts(6379)
    .start();

  // Set the Redis URL for the application to use
  process.env.REDIS_URL = `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`;

  return redisContainer;
}

export async function stopRedisContainer(): Promise<void> {
  if (redisContainer) {
    await redisContainer.stop();
    redisContainer = null;
    delete process.env.REDIS_URL;
  }
}

export function getRedisUrl(): string {
  if (!redisContainer) {
    throw new Error(
      'Redis container is not started. Call startRedisContainer() first.',
    );
  }
  return `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`;
}
