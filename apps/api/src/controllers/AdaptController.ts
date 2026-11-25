import type { Response } from 'express';
import { getAuthUserId, type AuthenticatedRequest } from '../middlewares/auth.js';
import type { AdaptTrailService } from '../services/AdaptTrailService.js';
import type { SpecialistService } from '../services/SpecialistService.js';

export class AdaptController {
  constructor(
    private readonly adaptTrailService: AdaptTrailService,
    private readonly specialistService: SpecialistService,
  ) {}

  getStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const status = await this.adaptTrailService.getStatus(getAuthUserId(req));
    res.status(200).json(status);
  };

  adaptAi = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.adaptTrailService.adaptWithAi(
      getAuthUserId(req),
      req.body.context,
    );
    res.status(200).json(result);
  };

  requestSpecialist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.specialistService.requestConsultation(getAuthUserId(req));
    res.status(201).json(result);
  };
}
