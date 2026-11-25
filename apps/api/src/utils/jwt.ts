import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JWT_EXPIRES_IN } from '../domain/constants.js';
import { UnauthorizedError } from '../errors/AppError.js';

export interface AuthTokenPayload {
  sub: string;
}

export function signAuthToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof decoded === 'string' || typeof decoded.sub !== 'string' || !decoded.sub) {
      throw new UnauthorizedError('Token de sessão inválido.');
    }
    return { sub: decoded.sub };
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      throw err;
    }
    throw new UnauthorizedError('Sessão expirada ou inválida.');
  }
}
