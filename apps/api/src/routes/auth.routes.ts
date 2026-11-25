import { Router } from 'express';
import type { AuthController } from '../controllers/AuthController.js';
import { requireAuth } from '../middlewares/auth.js';
import { authRateLimiter } from '../middlewares/rateLimit.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  router.post('/register', authRateLimiter, validate({ body: registerSchema }), controller.register);
  router.post('/login', authRateLimiter, validate({ body: loginSchema }), controller.login);
  router.post('/logout', controller.logout);
  router.get('/me', requireAuth, controller.me);

  return router;
}
