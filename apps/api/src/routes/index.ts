import { Router } from 'express';
import type { Container } from '../container.js';
import { createAdaptRouter } from './adapt.routes.js';
import { createAssessmentRouter } from './assessment.routes.js';
import { createAuthRouter } from './auth.routes.js';
import { createDiagnosticRouter } from './diagnostic.routes.js';
import { createProfileRouter } from './profile.routes.js';
import { createTrailRouter } from './trail.routes.js';
import { createTutorRouter } from './tutor.routes.js';

export function createApiRouter(container: Container): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.use('/auth', createAuthRouter(container.controllers.auth));
  router.use('/users/me', createProfileRouter(container.controllers.profile));
  router.use('/diagnostic', createDiagnosticRouter(container.controllers.diagnostic));
  router.use(
    '/trails',
    createTrailRouter(
      container.controllers.trail,
      container.controllers.diagnostic,
      container.controllers.adapt,
    ),
  );
  router.use('/tutor', createTutorRouter(container.controllers.tutor));
  router.use('/assessments', createAssessmentRouter(container.controllers.assessment));
  router.use('/adapt', createAdaptRouter(container.controllers.adapt));
  router.use('/profile', createProfileRouter(container.controllers.profile));

  return router;
}
