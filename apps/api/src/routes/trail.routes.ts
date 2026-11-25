import { Router } from 'express';
import type { TrailController } from '../controllers/TrailController.js';
import { requireAuth } from '../middlewares/auth.js';

export function createTrailRouter(controller: TrailController): Router {
  const router = Router();

  router.use(requireAuth);
  router.get('/active', controller.getActive);

  return router;
}
