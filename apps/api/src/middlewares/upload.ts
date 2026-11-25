import multer from 'multer';
import { ALLOWED_AVATAR_MIMES, MAX_AVATAR_BYTES } from '../domain/constants.js';
import { ValidationError } from '../errors/AppError.js';

const allowedMimesSet = new Set<string>(ALLOWED_AVATAR_MIMES);

export const avatarUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_AVATAR_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimesSet.has(file.mimetype)) {
      cb(new ValidationError('Formato de imagem inválido. Envie PNG, JPG ou WEBP.'));
      return;
    }
    cb(null, true);
  },
});
