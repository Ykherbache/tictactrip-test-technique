import { Container } from 'inversify';
import { setupControllerContainer } from './controller.inversify';
import { setupServiceContainer } from './service.inversify';
import { setupRepositoryContainer } from './repository.inversify';
import {
  setupExternalContributorsContainer,
  setupFakeContributorsContainer,
} from './externalServices.inversify';

export const iocContainer = new Container();
export function bindIOC() {
  setupControllerContainer(iocContainer);
  setupServiceContainer(iocContainer);
  setupRepositoryContainer();

  if (isUnitTestEnvironment()) {
    setupFakeContributorsContainer(iocContainer);
  } else {
    setupExternalContributorsContainer(iocContainer);
  }
}

function isUnitTestEnvironment(): boolean {
  return (
    process.env.NODE_ENV === 'test' &&
    !process.env.INTEGRATION_TEST &&
    typeof jest !== 'undefined'
  );
}
