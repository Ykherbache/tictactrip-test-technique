import 'reflect-metadata';
import { config } from './config';
import { createProductionApp } from './app/app';
export async function startServer() {
  const app = createProductionApp();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

startServer();
