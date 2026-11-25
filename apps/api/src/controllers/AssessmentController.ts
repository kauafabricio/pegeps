import type { Response } from 'express';
import { getAuthUserId, type AuthenticatedRequest } from '../middlewares/auth.js';
import type { AssessmentService } from '../services/AssessmentService.js';

export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const overview = await this.assessmentService.getOverview(getAuthUserId(req));
    res.status(200).json(overview);
  };

  start = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const started = await this.assessmentService.startAssessment(
      getAuthUserId(req),
      String(req.params.moduleId),
    );
    res.status(200).json(started);
  };

  submit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.assessmentService.submitAssessment(
      getAuthUserId(req),
      String(req.params.moduleId),
      req.body,
    );
    res.status(200).json(result);
  };
}
