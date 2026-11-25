import type { Response } from 'express';
import { getAuthUserId, type AuthenticatedRequest } from '../middlewares/auth.js';
import type { TutorService } from '../services/TutorService.js';

export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  step = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const output = await this.tutorService.step(getAuthUserId(req), req.body);
    res.status(200).json(output);
  };
}
