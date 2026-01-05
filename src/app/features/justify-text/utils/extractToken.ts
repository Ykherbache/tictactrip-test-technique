import { Request } from 'express';

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
