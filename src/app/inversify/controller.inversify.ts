import { Container } from 'inversify';
import { JustifyTextController } from '../features/justify-text/justifyTextController';
import { AuthController } from '../features/auth/authController';

export function setupControllerContainer(iocContainer: Container) {
  iocContainer.bind<JustifyTextController>(JustifyTextController).toSelf();
  iocContainer.bind<AuthController>(AuthController).toSelf();
}
