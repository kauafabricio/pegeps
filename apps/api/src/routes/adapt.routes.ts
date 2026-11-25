import { Router } from 'express';
import type { AdaptController } from '../controllers/AdaptController.js';
import { requireAuth } from '../middlewares/auth.js';
import { adaptAiRateLimiter } from '../middlewares/rateLimit.js';
import { validate } from '../middlewares/validate.js';
import { adaptAiSchema } from '../validators/adapt.validator.js';

export function createAdaptRouter(controller: AdaptController): Router {
  const router = Router();

  router.use(requireAuth);
  router.get('/status', controller.getStatus);
  router.post('/ai', adaptAiRateLimiter, validate({ body: adaptAiSchema }), controller.adaptAi);
  router.post('/specialist', controller.requestSpecialist);

  return router;
}
