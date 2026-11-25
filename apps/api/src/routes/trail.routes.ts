import { Router } from 'express';
import type { AdaptController } from '../controllers/AdaptController.js';
import type { DiagnosticController } from '../controllers/DiagnosticController.js';
import type { TrailController } from '../controllers/TrailController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { chooseTrailByIdSchema } from '../validators/diagnostic.validator.js';
import { createAdaptRouter } from './adapt.routes.js';

export function createTrailRouter(
  controller: TrailController,
  diagnosticController?: DiagnosticController,
  adaptController?: AdaptController,
): Router {
  const router = Router();

  router.use(requireAuth);
  router.get('/active', controller.getActive);

  if (diagnosticController) {
    router.get('/options', diagnosticController.getTrailOptions);
    router.post('/choose', validate({ body: chooseTrailByIdSchema }), diagnosticController.chooseTrailById);
  }

  if (adaptController) {
    router.use('/adapt', createAdaptRouter(adaptController));
  }

  return router;
}
