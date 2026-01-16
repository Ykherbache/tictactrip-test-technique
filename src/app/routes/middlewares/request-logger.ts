import { Request, Response } from 'express';
import { iocContainer } from '../../inversify/config.inversify';
import { TYPE } from '../../inversify/type.inversify';
import { AuthRepository } from '../../features/auth/types/authRepository';
import { extractToken } from '../../features/justify-text/utils/extractToken';
import { logger } from '../../utils/logger';

export async function requestLogger(
  request: Request,
  response: Response,
  next: () => void,
): Promise<void> {
  const startTime = Date.now();

  let userIdentifier = 'guest';
  const token = extractToken(request);
  if (token) {
    try {
      const authRepository = iocContainer.get<AuthRepository>(
        TYPE.AuthRepository,
      );
      const email = await authRepository.getEmailByToken(token);
      if (email) {
        userIdentifier = email;
      }
    } catch (error) {
      logger.warn('Error retrieving email from token', { error });
    }
  }

  const originalEnd = response.end.bind(response);
  response.end = function (
    chunk?: unknown,
    encodingOrCb?: BufferEncoding | (() => void),
    cb?: () => void,
  ): Response {
    const duration = Date.now() - startTime;
    const logMessage = `${response.statusCode} ${request.method} ${duration}ms ${userIdentifier} ${request.url}`;

    if (response.statusCode >= 500) {
      logger.error(logMessage);
    } else if (response.statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
    if (typeof encodingOrCb === 'function') {
      return originalEnd(chunk, encodingOrCb);
    } else {
      return originalEnd(chunk, encodingOrCb, cb);
    }
  };

  next();
}
