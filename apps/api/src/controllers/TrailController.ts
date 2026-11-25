import type { Response } from 'express';
import { getAuthUserId, type AuthenticatedRequest } from '../middlewares/auth.js';
import type { TrailService } from '../services/TrailService.js';

export class TrailController {
  constructor(private readonly trailService: TrailService) {}

  getActive = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const graph = await this.trailService.getActiveTrailGraph(getAuthUserId(req));
    res.status(200).json(graph);
  };
}
