import { AuthRedisRepository } from '../../../src/app/features/auth/authRedisRepository';
import { WordQuotaRedisRepository } from '../../../src/app/features/justify-text/wordQuotaRedisRepository';
import { CacheApi } from '../../../src/app/external-services/types/cacheApi';
import { TYPE } from '../../../src/app/inversify/type.inversify';
import { getAppContainer } from './setup-test-app';

export function setupRedisIntegration() {
  let authRepository: AuthRedisRepository;
  let wordQuotaRepository: WordQuotaRedisRepository;
  let cacheApi: CacheApi;

  beforeAll(async () => {
    const container = getAppContainer();
    if (!container) {
      throw new Error('IoC container not initialized.');
    }
    cacheApi = container.get<CacheApi>(TYPE.CacheApi);
    authRepository = container.get<AuthRedisRepository>(TYPE.AuthRepository);
    wordQuotaRepository = container.get<WordQuotaRedisRepository>(
      TYPE.WordQuotaRepository,
    );
    await cacheApi.connect();
  });

  afterEach(async () => {
    if (authRepository) {
      await authRepository.clearAll();
    }
    if (wordQuotaRepository) {
      await wordQuotaRepository.clearAll();
    }
  });

  afterAll(async () => {
    if (cacheApi) {
      await cacheApi.disconnect();
    }
  });

  return {
    getAuthRepo: (): AuthRedisRepository => authRepository,
    getWordQuotaRepo: (): WordQuotaRedisRepository => wordQuotaRepository,
  };
}
