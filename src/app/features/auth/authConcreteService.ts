import { Err, Ok, Result } from '@gum-tech/flow-ts';
import { Request } from 'express';
import { inject } from 'inversify';
import { AuthService } from './types/authService';
import { AuthRepository } from './types/authRepository';
import {
  IS_CONNECTED_ERROR,
  isConnectedError,
} from './errors/isConnectedError';
import { TYPE } from '../../inversify/type.inversify';
import { v4 as uuidv4 } from 'uuid';

export class AuthConcreteService implements AuthService {
  constructor(
    @inject(TYPE.AuthRepository)
    private readonly authRepository: AuthRepository,
  ) {}

  async authenticate(email: string): Promise<string> {
    const token = uuidv4();

    await this.authRepository.saveToken(token, email);

    return token;
  }

  async isUserConnected(
    request: Request,
  ): Promise<Result<boolean, isConnectedError>> {
    const authHeader = request.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
      return Promise.resolve(
        Err(IS_CONNECTED_ERROR.AUTHORIZATION_HEADER_MALFORMED),
      );
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return Promise.resolve(
        Err(IS_CONNECTED_ERROR.AUTHORIZATION_HEADER_MALFORMED),
      );
    }

    try {
      const hasToken = await this.authRepository.hasToken(token);
      if (hasToken) {
        return Promise.resolve(Ok(true));
      } else {
        return Promise.resolve(
          Err(IS_CONNECTED_ERROR.ERROR_DECODING_JWT_TOKEN),
        );
      }
    } catch (error) {
      return Promise.resolve(Err(IS_CONNECTED_ERROR.ERROR_DECODING_JWT_TOKEN));
    }
  }
}
