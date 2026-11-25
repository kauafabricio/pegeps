import type { NextFunction, Request, Response } from 'express';
import { AUTH_COOKIE_NAME } from '../domain/constants.js';
import { UnauthorizedError } from '../errors/AppError.js';
import { verifyAuthToken } from '../utils/jwt.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
  if (!token) {
    throw new UnauthorizedError('Faça login para continuar.');
  }

  const payload = verifyAuthToken(token);
  req.userId = payload.sub;
  next();
}

export function getAuthUserId(req: AuthenticatedRequest): string {
  if (!req.userId) {
    throw new UnauthorizedError('Usuário não autenticado.');
  }
  return req.userId;
}
