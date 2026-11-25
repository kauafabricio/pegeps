import { Router } from 'express';
import type { AssessmentController } from '../controllers/AssessmentController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  moduleIdParamsSchema,
  submitAssessmentSchema,
} from '../validators/assessment.validator.js';

export function createAssessmentRouter(controller: AssessmentController): Router {
  const router = Router();

  router.use(requireAuth);
  router.get('/', controller.list);
  router.get('/:moduleId/start', validate({ params: moduleIdParamsSchema }), controller.start);
  router.post('/:moduleId/start', validate({ params: moduleIdParamsSchema }), controller.start);
  router.post(
    '/:moduleId/submit',
    validate({ params: moduleIdParamsSchema, body: submitAssessmentSchema }),
    controller.submit,
  );

  return router;
}
