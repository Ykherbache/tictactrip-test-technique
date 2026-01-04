import { repositoryType } from './types/repository.type';
import { serviceType } from './types/service.type';

export const TYPE = {
  ...serviceType,
  ...repositoryType,
};
