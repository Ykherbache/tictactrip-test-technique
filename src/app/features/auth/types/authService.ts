import { Result } from '@gum-tech/flow-ts';
import { isConnectedError } from '../errors/isConnectedError';

import { Request } from 'express';
export interface AuthService {
  authenticate(email: string): Promise<string>;
  isUserConnected(request: Request): Promise<Result<boolean, isConnectedError>>;
}
