import { Router } from 'express';
import type { TutorController } from '../controllers/TutorController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { tutorStepSchema } from '../validators/tutor.validator.js';

export function createTutorRouter(controller: TutorController): Router {
  const router = Router();

  router.use(requireAuth);
  router.post('/step', validate({ body: tutorStepSchema }), controller.step);

  return router;
}
