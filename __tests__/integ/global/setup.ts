import { startRedisContainer } from '../utils/redis-container';
import { logger } from '../../../src/app/utils/logger';
export default async function globalSetup(): Promise<void> {
  logger.info('Starting Redis container for integration tests...');

  process.env.INTEGRATION_TEST = 'true';

  try {
    await startRedisContainer();
    logger.debug('Redis container started successfully');
  } catch (error) {
    logger.error('Failed to start Redis container:', error);
    throw error;
  }
}
