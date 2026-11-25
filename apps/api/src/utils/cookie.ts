import type { CookieOptions } from 'express';
import { env } from '../config/env.js';
import { AUTH_COOKIE_MAX_AGE_MS } from '../domain/constants.js';

export function buildAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

export function buildClearAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
  };
}
