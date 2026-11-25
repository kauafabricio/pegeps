import rateLimit from 'express-rate-limit';
import type { AuthenticatedRequest } from './auth.js';

const rateLimitBody = {
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Muitas tentativas em sequência. Aguarde alguns minutos e tente novamente.',
  },
};

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitBody,
});

export const adaptAiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const authReq = req as AuthenticatedRequest;
    return authReq.userId ?? req.ip ?? 'unknown';
  },
  message: rateLimitBody,
});
