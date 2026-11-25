import type { Response } from 'express';
import { getAuthUserId, type AuthenticatedRequest } from '../middlewares/auth.js';
import type { DiagnosticService } from '../services/DiagnosticService.js';

export class DiagnosticController {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  getQuestions = (_req: AuthenticatedRequest, res: Response): void => {
    const questions = this.diagnosticService.getQuestions();
    res.status(200).json({ questions });
  };

  submit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const summary = await this.diagnosticService.submitDiagnostic(
      getAuthUserId(req),
      req.body.answers,
    );
    res.status(200).json(summary);
  };

  getResult = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const summary = await this.diagnosticService.getLatestResult(getAuthUserId(req));
    res.status(200).json(summary);
  };

  chooseTrail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.diagnosticService.chooseTrail(
      getAuthUserId(req),
      req.body.choice,
    );
    res.status(200).json(result);
  };
}
