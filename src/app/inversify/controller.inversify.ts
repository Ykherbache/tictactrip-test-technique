import { Container } from 'inversify';
import { JustifyTextController } from '../features/justify-text/justifyTextController';

export function setupControllerContainer(iocContainer: Container) {
  iocContainer.bind<JustifyTextController>(JustifyTextController).toSelf();
}
