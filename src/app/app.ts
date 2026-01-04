import { bindIOC } from './inversify/config.inversify';
import express from 'express';
import { setupMiddleware } from './routes/middlewares/middleware';
import { setupRoutes } from './routes/route';
export function createProductionApp(): express.Application {
  const app = express();
  bindIOC();
  setupMiddleware(app);
  setupRoutes(app);
  return app;
}
