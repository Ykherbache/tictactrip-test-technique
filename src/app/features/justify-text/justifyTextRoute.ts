import { Router } from 'express';
import { iocContainer } from '../../inversify/config.inversify';
import { JustifyTextController } from './justifyTextController';
import { isConnected } from '../auth/middlewares/isConnected';

function getJustifyTextController() {
  return iocContainer.get(JustifyTextController);
}
export function setupJustifyTextRoutes(): Router {
  const justifyTextController = getJustifyTextController();
  const router = Router();
  router.post('/justify', isConnected, justifyTextController.justify);
  return router;
}
