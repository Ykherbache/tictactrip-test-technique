import { setupAuthRouter } from '../features/auth/authRoute';
import { setupJustifyTextRoutes } from '../features/justify-text/justifyTextRoute';
import * as Sentry from '@sentry/node';

import { Express, NextFunction, Request, Response } from 'express';
export function setupRoutes(app: Express) {
  const baseRoutePath = '/api/';
  const justifyTextRouter = setupJustifyTextRoutes();
  const authRouter = setupAuthRouter();
  app.use(baseRoutePath, justifyTextRouter);
  app.use(baseRoutePath, authRouter);

  app.get('/debug-sentry', () => {
    throw new Error('My first Sentry error!');
  });
  if (process.env.NODE_ENV !== 'production') {
    app.get('/debug-sentry', () => {
      throw new Error('My first Sentry error!');
    });
  }
  //need to call the sentry express handler after all routes
  Sentry.setupExpressErrorHandler(app);
  // @ts-ignore
  app.use(function onError(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    // @ts-ignore
    res.status(500).send(res.sentry || err.message);
  });
}
