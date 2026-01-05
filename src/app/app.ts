import { bindIOC, iocContainer } from './inversify/config.inversify';
import express from 'express';
import { setupMiddleware } from './routes/middlewares/middleware';
import { setupRoutes } from './routes/route';
import { TYPE } from './inversify/type.inversify';
import { AuthRepository } from './features/auth/types/authRepository';
export async function createProductionApp(): Promise<express.Application> {
  const app = express();
  bindIOC();
  setupMiddleware(app);
  setupRoutes(app);
  await initAuth();

  return app;
}
async function initAuth(): Promise<void> {
  const authRepository = iocContainer.get<AuthRepository>(TYPE.AuthRepository);
  try {
    await authRepository.connect();
  } catch (err) {
    console.error('Error connect to auth api : ', err);
  }
}
