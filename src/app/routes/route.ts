import { setupJustifyTextRoutes } from '../features/justify-text/justifyTextRoute';

import { Express } from 'express';
export function setupRoutes(app: Express) {
  const baseRoutePath = '/api/';
  const justifyTextRouter = setupJustifyTextRoutes();
  app.use(baseRoutePath, justifyTextRouter);
}
