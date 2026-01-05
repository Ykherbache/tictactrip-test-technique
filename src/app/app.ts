import { bindIOC, iocContainer } from './inversify/config.inversify';
import express from 'express';
import { setupMiddleware } from './routes/middlewares/middleware';
import { setupRoutes } from './routes/route';
import { setupSwaggerRoutes } from './routes/swagger/swagger.route';
import { TYPE } from './inversify/type.inversify';
import { CacheApi } from './external-services/types/cacheApi';

export async function createProductionApp(): Promise<express.Application> {
  const app = express();
  bindIOC();
  setupMiddleware(app);
  setupSwaggerRoutes(app);
  setupRoutes(app);
  await initCache();

  return app;
}

async function initCache(): Promise<void> {
  const cacheApi = iocContainer.get<CacheApi>(TYPE.CacheApi);
  try {
    await cacheApi.connect();
  } catch (err) {
    console.error('Error connecting to cache: ', err);
    throw new Error('app needs connection to a redis instance to work.');
  }
}
