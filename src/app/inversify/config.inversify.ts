import { Container } from 'inversify';
import { setupControllerContainer } from './controller.inversify';
import { setupServiceContainer } from './service.inversify';
import { setupRepositoryContainer } from './repository.inversify';

export const iocContainer = new Container();
export function bindIOC() {
  setupControllerContainer(iocContainer);
  setupServiceContainer(iocContainer);
  setupRepositoryContainer(iocContainer);
}
