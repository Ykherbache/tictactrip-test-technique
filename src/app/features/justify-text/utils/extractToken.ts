import { Request } from 'express';

/**
 * Extracts the Bearer token from the HTTP `Authorization` header of a request.
 *
 * Reads the request's `authorization` header and returns the token when the scheme is `Bearer`.
 *
 * @param request - The Express request whose `authorization` header will be inspected
 * @returns The token string if the header is a valid `Bearer <token>` value, `null` otherwise
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers['authorization'];
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}