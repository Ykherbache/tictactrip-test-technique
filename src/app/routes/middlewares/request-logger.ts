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

  // Get user identifier (email or guest)
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
      // If there's an error getting the email, keep it as guest
      logger.warn('Error retrieving email from token', { error });
    }
  }

  // Override response.end to log when response is finished
  const originalEnd = response.end.bind(response);
  response.end = function (
    chunk?: any,
    encodingOrCb?: BufferEncoding | (() => void),
    cb?: () => void,
  ): Response {
    const duration = Date.now() - startTime;
    logger.info(
      `${response.statusCode} ${request.method} ${duration}ms ${userIdentifier} ${request.url}`,
    );

    // Call original end with proper argument handling
    if (typeof encodingOrCb === 'function') {
      return originalEnd(chunk, encodingOrCb);
    } else {
      return originalEnd(chunk, encodingOrCb, cb);
    }
  };

  next();
}
