import { AuthRedisRepository } from '../../../src/app/features/auth/authRedisRepository';
import { TYPE } from '../../../src/app/inversify/type.inversify';
import { getAppContainer } from './setup-test-app';

export function setupRedisIntegration() {
  let authRepository: AuthRedisRepository;

  beforeAll(async () => {
    const container = getAppContainer();
    if (container) {
      authRepository = container.get<AuthRedisRepository>(TYPE.AuthRepository);
      await authRepository.connect();
    }
  });

  afterEach(async () => {
    if (authRepository) {
      await authRepository.clearAll();
    }
  });

  afterAll(async () => {
    if (authRepository) {
      await authRepository.disconnect();
    }
  });

  return {
    getAuthRepo: () => authRepository,
  };
}
