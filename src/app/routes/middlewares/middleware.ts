import * as express from 'express';
import helmet from 'helmet';
import { globalRateLimiter } from './global-rate-limiter';
import { requestLogger } from './request-logger';

export function setupMiddleware(app: express.Express) {
  app.use(requestLogger);
  app.use(globalRateLimiter);
  app.use(express.json());
  app.use(express.text({ type: 'text/plain', limit: '25mb' }));
  app.use(helmet());
}
