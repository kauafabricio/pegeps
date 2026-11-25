import { Router } from 'express';
import type { DiagnosticController } from '../controllers/DiagnosticController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { chooseTrailSchema, submitDiagnosticSchema } from '../validators/diagnostic.validator.js';

export function createDiagnosticRouter(controller: DiagnosticController): Router {
  const router = Router();

  router.use(requireAuth);
  router.get('/questions', controller.getQuestions);
  router.post('/submit', validate({ body: submitDiagnosticSchema }), controller.submit);
  router.get('/result', controller.getResult);
  router.post('/choose-trail', validate({ body: chooseTrailSchema }), controller.chooseTrail);

  return router;
}
