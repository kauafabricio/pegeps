export const AUTH_COOKIE_NAME = 'pegeps_token';
export const JWT_EXPIRES_IN = '7d';
export const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const BCRYPT_COST = 12;

export const ADAPTATION_COOLDOWN_DAYS = 15;
export const ASSESSMENT_QUESTIONS_COUNT = 10;
export const ASSESSMENT_PASS_THRESHOLD = 7;

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const ALLOWED_AVATAR_MIMES = ['image/png', 'image/jpeg', 'image/webp'] as const;

export const DIAGNOSTIC_LEVEL_THRESHOLDS = {
  INTERMEDIATE_MIN: 2,
  ADVANCED_MIN: 3,
} as const;
