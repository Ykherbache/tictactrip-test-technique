import { startRedisContainer } from '../utils/redis-container';

export default async function globalSetup(): Promise<void> {
  console.log('Starting Redis container for integration tests...');

  process.env.INTEGRATION_TEST = 'true';

  try {
    await startRedisContainer();
    console.log('Redis container started successfully');
  } catch (error) {
    console.error('Failed to start Redis container:', error);
    throw error;
  }
}
