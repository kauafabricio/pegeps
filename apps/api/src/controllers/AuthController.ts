import type { Request, Response } from 'express';
import { AUTH_COOKIE_NAME } from '../domain/constants.js';
import { getAuthUserId, type AuthenticatedRequest } from '../middlewares/auth.js';
import type { AuthService } from '../services/AuthService.js';
import { buildAuthCookieOptions, buildClearAuthCookieOptions } from '../utils/cookie.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const { user, token } = await this.authService.register(req.body);
    res.cookie(AUTH_COOKIE_NAME, token, buildAuthCookieOptions());
    res.status(201).json({ user });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { user, token } = await this.authService.login(req.body);
    res.cookie(AUTH_COOKIE_NAME, token, buildAuthCookieOptions());
    res.status(200).json({ user });
  };

  logout = (_req: Request, res: Response): void => {
    res.clearCookie(AUTH_COOKIE_NAME, buildClearAuthCookieOptions());
    res.status(200).json({ ok: true });
  };

  me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await this.authService.getCurrentUser(getAuthUserId(req));
    res.status(200).json({ user });
  };
}
