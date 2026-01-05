import { bindIOC, iocContainer } from './inversify/config.inversify';
import express from 'express';
import { setupMiddleware } from './routes/middlewares/middleware';
import { setupRoutes } from './routes/route';
import { TYPE } from './inversify/type.inversify';
import { AuthRepository } from './features/auth/types/authRepository';
export function createProductionApp(): express.Application {
  const app = express();
  bindIOC();
  setupMiddleware(app);
  setupRoutes(app);
  initAuth();

  return app;
}
function initAuth(): void {
  const authRepository = iocContainer.get<AuthRepository>(TYPE.AuthRepository);
  authRepository.connect().catch((err) => {
    console.error('Error connect to auth api : ', err);
  });
}
