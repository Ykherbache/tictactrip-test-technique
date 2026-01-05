export default async function globalTeardown(): Promise<void> {
  console.log('Global teardown started...');

  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('Stopping Redis container...');

  delete process.env.INTEGRATION_TEST;

  console.log('Redis container stopped');
  console.log('Global teardown completed');
}
