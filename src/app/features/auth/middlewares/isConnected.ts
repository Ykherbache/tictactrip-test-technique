import { isErr } from '@gum-tech/flow-ts';
import { iocContainer } from '../../../inversify/config.inversify';
import { TYPE } from '../../../inversify/type.inversify';
import { MiddlewareFunction } from '../../../types/middlewareFunction';
import { IS_CONNECTED_ERROR } from '../errors/isConnectedError';
import { AuthService } from '../types/authService';

export const isConnected: MiddlewareFunction = async (
  request,
  response,
  next,
): Promise<void> => {
  const authApi = iocContainer.get<AuthService>(TYPE.AuthService);
  const result = await authApi.isUserConnected(request);
  if (isErr(result)) {
    switch (result.unwrapErr()) {
      case IS_CONNECTED_ERROR.AUTHORIZATION_HEADER_MALFORMED:
        response.status(401).send('No authorization header');
        return;
      case IS_CONNECTED_ERROR.ERROR_DECODING_JWT_TOKEN:
        response.status(403).send('Invalid token');
        return;
    }
  }
  next();
};
