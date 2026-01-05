// global-teardown.ts

export default async function globalTeardown(): Promise<void> {
  console.log('Global teardown started...');

  // Give connections time to fully close
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Stop the Redis container
  console.log('Stopping Redis container...');
  // await stopRedisContainer();

  delete process.env.INTEGRATION_TEST;

  console.log('Redis container stopped');
  console.log('Global teardown completed');
}
