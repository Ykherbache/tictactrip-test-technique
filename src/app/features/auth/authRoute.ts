import { Router } from 'express';
import { iocContainer } from '../../inversify/config.inversify';
import { AuthController } from './authController';

function getAuthController() {
  return iocContainer.get(AuthController);
}
export function setupAuthRouter(): Router {
  const authController = getAuthController();
  const router = Router();
  router.post('/token', authController.generateToken);
  return router;
}
