import { Err, Ok, Result } from '@gum-tech/flow-ts';
import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { AuthService } from './types/authService';
import { AuthRepository } from './types/authRepository';
import {
  IS_CONNECTED_ERROR,
  isConnectedError,
} from './errors/isConnectedError';
import { TYPE } from '../../inversify/type.inversify';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class AuthConcreteService implements AuthService {
  constructor(
    @inject(TYPE.AuthRepository)
    private readonly authRepository: AuthRepository,
  ) {}

  async authenticate(email: string): Promise<string> {
    const existingToken = await this.authRepository.getTokenByEmail(email);

    if (existingToken) {
      await this.authRepository.deleteToken(existingToken);
    }

    const token = uuidv4();
    await this.authRepository.saveToken(token, email);

    return token;
  }

  async isUserConnected(
    request: Request,
  ): Promise<Result<boolean, isConnectedError>> {
    const authHeader = request.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
      return Err(IS_CONNECTED_ERROR.AUTHORIZATION_HEADER_MALFORMED);
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return Err(IS_CONNECTED_ERROR.AUTHORIZATION_HEADER_MALFORMED);
    }

    try {
      const hasToken = await this.authRepository.hasToken(token);
      if (hasToken) {
        return Ok(true);
      } else {
        return Err(IS_CONNECTED_ERROR.ERROR_DECODING_TOKEN);
      }
    } catch (error) {
      return Err(IS_CONNECTED_ERROR.ERROR_DECODING_TOKEN);
    }
  }
}
