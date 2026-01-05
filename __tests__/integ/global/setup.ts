import { startRedisContainer } from '../utils/redis-container';

export default async function globalSetup(): Promise<void> {
  console.log('Starting Redis container for integration tests...');

  // Mark as integration test to use Redis repository
  process.env.INTEGRATION_TEST = 'true';

  await startRedisContainer();

  console.log('Redis container started successfully');
}
