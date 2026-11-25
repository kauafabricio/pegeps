import type { Response } from 'express';
import { ValidationError } from '../errors/AppError.js';
import { getAuthUserId, type AuthenticatedRequest } from '../middlewares/auth.js';
import type { ProfileService } from '../services/ProfileService.js';

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  get = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await this.profileService.getProfile(getAuthUserId(req));
    res.status(200).json({ user });
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await this.profileService.updateProfile(getAuthUserId(req), req.body);
    res.status(200).json({ user });
  };

  uploadAvatar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.file) {
      throw new ValidationError('Envie uma imagem PNG, JPG ou WEBP.');
    }

    const user = await this.profileService.uploadAvatar(getAuthUserId(req), {
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });
    res.status(200).json({ user });
  };
}
