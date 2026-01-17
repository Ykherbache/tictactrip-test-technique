import { logger } from '../../../src/app/utils/logger';
export default async function globalTeardown(): Promise<void> {
  logger.debug('Global teardown started...');

  await new Promise((resolve) => setTimeout(resolve, 500));

  logger.debug('Stopping Redis container...');

  delete process.env.INTEGRATION_TEST;

  logger.debug('Redis container stopped');
  logger.debug('Global teardown completed');
}
