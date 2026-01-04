import * as express from 'express';
import helmet from 'helmet';

export function setupMiddleware(app: express.Express) {
  app.use(express.json());
  app.use(express.text({ type: 'text/plain', limit: '25mb' }));
  app.use(helmet());
}
