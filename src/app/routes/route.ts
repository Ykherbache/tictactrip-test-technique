import { setupAuthRouter } from '../features/auth/authRoute';
import { setupJustifyTextRoutes } from '../features/justify-text/justifyTextRoute';
import * as Sentry from '@sentry/node';

import { Express } from 'express';
export function setupRoutes(app: Express) {
  const baseRoutePath = '/api/';
  const justifyTextRouter = setupJustifyTextRoutes();
  const authRouter = setupAuthRouter();
  app.use(baseRoutePath, justifyTextRouter);
  app.use(baseRoutePath, authRouter);

  app.get('/debug-sentry', () => {
    throw new Error('My first Sentry error!');
  });

  //need to call the sentry express handler after all routes
  Sentry.setupExpressErrorHandler(app);
  app.use(function onError(err: Error, _: any, res: any, __: any) {
    res.statusCode = 500;
    res.end(res.sentry || err.message + '\n');
  });
}
