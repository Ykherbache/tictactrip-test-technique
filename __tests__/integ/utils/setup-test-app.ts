import express from 'express';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import {
  bindIOC,
  iocContainer,
} from '../../../src/app/inversify/config.inversify';
import { setupMiddleware } from '../../../src/app/routes/middlewares/middleware';
import { setupRoutes } from '../../../src/app/routes/route';
import { Container } from 'inversify';

export function createTestApp(): TestAgent {
  const app = express();
  bindIOC();

  setupMiddleware(app);
  setupRoutes(app);
  return supertest(app);
}

export function getAppContainer(): Container {
  return iocContainer;
}
