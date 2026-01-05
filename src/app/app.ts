import { bindIOC, iocContainer } from './inversify/config.inversify';
import express from 'express';
import { setupMiddleware } from './routes/middlewares/middleware';
import { setupRoutes } from './routes/route';
import { TYPE } from './inversify/type.inversify';
import { CacheApi } from './external-services/types/cacheApi';

/**
 * Create and configure an Express application for production.
 *
 * Binds IOC container, registers middleware and routes, and initializes the cache before returning the app.
 *
 * @returns An Express application instance configured for production use
 */
export async function createProductionApp(): Promise<express.Application> {
  const app = express();
  bindIOC();
  setupMiddleware(app);
  setupRoutes(app);
  await initCache();

  return app;
}

/**
 * Initializes the application's cache connection.
 *
 * Retrieves the CacheApi implementation from the IOC container and calls its `connect` method.
 * If the connection attempt fails, logs an error to the console.
 */
async function initCache(): Promise<void> {
  const cacheApi = iocContainer.get<CacheApi>(TYPE.CacheApi);
  try {
    await cacheApi.connect();
  } catch (err) {
    console.error('Error connecting to cache: ', err);
  }
}