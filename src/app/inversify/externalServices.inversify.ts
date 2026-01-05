import { Container } from 'inversify';

import { AuthRedisRepository } from '../features/auth/authRedisRepository';
import { AuthRepository } from '../features/auth/types/authRepository';
import { TYPE } from './type.inversify';
import { AuthInMemoryRepository } from '../features/auth/authInMemoryRepository';

// this is created to separate services that use
// external contributors like redis postgres rabbitmq
// from the rest of services
export function setupExternalContributorsContainer(
  iocContainer: Container,
): void {
  iocContainer
    .bind<AuthRepository>(TYPE.AuthRepository)
    .to(AuthRedisRepository)
    .inSingletonScope();
}
// this is a fake created to to easily tests in unit tests
export function setupFakeContributorsContainer(iocContainer: Container): void {
  iocContainer
    .bind<AuthRepository>(TYPE.AuthRepository)
    .to(AuthInMemoryRepository)
    .inSingletonScope();
}
