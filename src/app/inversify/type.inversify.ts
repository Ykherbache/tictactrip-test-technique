import { repositoryType } from './types/repository.type';
import { serviceType } from './types/service.type';
import { externalServicesType } from './types/externalServices.type';

export const TYPE = {
  ...serviceType,
  ...repositoryType,
  ...externalServicesType,
};
