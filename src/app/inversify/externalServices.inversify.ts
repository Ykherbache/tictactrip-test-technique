import { Container } from 'inversify';

import { AuthRedisRepository } from '../features/auth/authRedisRepository';
import { AuthRepository } from '../features/auth/types/authRepository';
import { TYPE } from './type.inversify';
import { AuthInMemoryRepository } from '../features/auth/authInMemoryRepository';
import { WordQuotaRedisRepository } from '../features/justify-text/wordQuotaRedisRepository';
import { WordQuotaRepository } from '../features/justify-text/types/wordQuotaRepository';
import { WordQuotaInMemoryRepository } from '../features/justify-text/wordQuotaInMemoryRepository';
import { CacheApi } from '../external-services/types/cacheApi';
import { RedisCacheApi } from '../external-services/redisCacheApi';

// this is created to separate services that use
// external contributors like redis postgres rabbitmq
/**
 * Registers external (production) implementations into the given IoC container.
 *
 * Binds CacheApi to RedisCacheApi, AuthRepository to AuthRedisRepository, and
 * WordQuotaRepository to WordQuotaRedisRepository, all in singleton scope.
 *
 * @param iocContainer - The Inversify container to configure
 */
export function setupExternalContributorsContainer(
  iocContainer: Container,
): void {
  iocContainer
    .bind<CacheApi>(TYPE.CacheApi)
    .to(RedisCacheApi)
    .inSingletonScope();
  iocContainer
    .bind<AuthRepository>(TYPE.AuthRepository)
    .to(AuthRedisRepository)
    .inSingletonScope();
  iocContainer
    .bind<WordQuotaRepository>(TYPE.WordQuotaRepository)
    .to(WordQuotaRedisRepository)
    .inSingletonScope();
}
/**
 * Configure the provided IoC container with in-memory contributor implementations for tests.
 *
 * Binds AuthRepository to AuthInMemoryRepository and WordQuotaRepository to WordQuotaInMemoryRepository in singleton scope.
 *
 * @param iocContainer - The Inversify container to configure with fake contributor bindings for unit tests
 */
export function setupFakeContributorsContainer(iocContainer: Container): void {
  iocContainer
    .bind<AuthRepository>(TYPE.AuthRepository)
    .to(AuthInMemoryRepository)
    .inSingletonScope();
  iocContainer
    .bind<WordQuotaRepository>(TYPE.WordQuotaRepository)
    .to(WordQuotaInMemoryRepository)
    .inSingletonScope();
}