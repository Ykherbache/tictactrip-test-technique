import { setupAuthRouter } from '../features/auth/authRoute';
import { setupJustifyTextRoutes } from '../features/justify-text/justifyTextRoute';

import { Express } from 'express';
export function setupRoutes(app: Express) {
  const baseRoutePath = '/api/';
  const justifyTextRouter = setupJustifyTextRoutes();
  const authRouter = setupAuthRouter();
  app.use(baseRoutePath, justifyTextRouter);
  app.use(baseRoutePath, authRouter);
}
