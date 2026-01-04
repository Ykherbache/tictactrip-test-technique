import { Container } from 'inversify';
import { TYPE } from './type.inversify';
import { AuthRepository } from '../features/auth/types/authRepository';
import { AuthInMemoryRepository } from '../features/auth/authInMemoryRepository';

export function setupRepositoryContainer(iocContainer: Container) {
  iocContainer
    .bind<AuthRepository>(TYPE.AuthRepository)
    .to(AuthInMemoryRepository)
    .inSingletonScope();
}
