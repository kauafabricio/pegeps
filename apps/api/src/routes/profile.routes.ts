import { Router } from 'express';
import type { ProfileController } from '../controllers/ProfileController.js';
import { requireAuth } from '../middlewares/auth.js';
import { avatarUploadMiddleware } from '../middlewares/upload.js';
import { validate } from '../middlewares/validate.js';
import { updateProfileSchema } from '../validators/profile.validator.js';

export function createProfileRouter(controller: ProfileController): Router {
  const router = Router();

  router.use(requireAuth);
  router.get('/', controller.get);
  router.patch('/', validate({ body: updateProfileSchema }), controller.update);
  router.post('/avatar', avatarUploadMiddleware.single('avatar'), controller.uploadAvatar);

  return router;
}
