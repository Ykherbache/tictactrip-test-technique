import { Router } from 'express';
import { iocContainer } from '../../inversify/config.inversify';
import { JustifyTextController } from './justifyTextController';

function getJustifyTextController() {
  return iocContainer.get(JustifyTextController);
}
export function setupJustifyTextRoutes(): Router {
  const justifyTextController = getJustifyTextController();
  const router = Router();
  router.post('/justify', justifyTextController.justify);
  return router;
}
