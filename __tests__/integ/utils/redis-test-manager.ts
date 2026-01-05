import { CacheApi } from '../../../src/app/external-services/types/cacheApi';
import { TYPE } from '../../../src/app/inversify/type.inversify';
import { getAppContainer } from './setup-test-app';

export function setupRedisIntegration() {
  let cacheApi: CacheApi;

  beforeAll(async () => {
    const container = getAppContainer();
    if (!container) {
      throw new Error('IoC container not initialized.');
    }
    cacheApi = container.get<CacheApi>(TYPE.CacheApi);

    await cacheApi.connect();
  });

  afterEach(async () => {
    await cacheApi.clearAll();
  });

  afterAll(async () => {
    if (cacheApi) {
      await cacheApi.disconnect();
    }
  });
}
