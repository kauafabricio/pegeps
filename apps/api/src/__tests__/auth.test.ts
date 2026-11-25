import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { AUTH_COOKIE_NAME } from '../domain/constants.js';
import { clearTestDb, connectTestDb, disconnectTestDb } from './setup-db.js';

describe('Auth — Cadastro, login, duplicidade e /auth/me', () => {
  const app = createApp();

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it('cadastra usuário com cookie pegeps_session sem expor passwordHash e bloqueia e-mail duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Maria Silva', email: 'maria@pegeps.test', password: 'Password123!' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('maria@pegeps.test');
    expect(res.body.user.passwordHash).toBeUndefined();

    const rawCookie = res.headers['set-cookie'];
    const setCookie = Array.isArray(rawCookie) ? rawCookie : rawCookie ? [rawCookie] : [];
    expect(setCookie.some((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`))).toBe(true);

    const dup = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Maria 2', email: 'maria@pegeps.test', password: 'Password123!' });

    expect(dup.status).toBe(409);
    expect(dup.body.error.code).toBe('EMAIL_IN_USE');
  });

  it('realiza login e acessa /api/auth/me com o cookie de sessão', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'João Souza', email: 'joao@pegeps.test', password: 'Password123!' });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joao@pegeps.test', password: 'Password123!' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.passwordHash).toBeUndefined();

    const rawCookies = loginRes.headers['set-cookie'];
    const cookies = Array.isArray(rawCookies) ? rawCookies : rawCookies ? [rawCookies] : [];
    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookies);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('joao@pegeps.test');
    expect(meRes.body.user.onboardingStep).toBeDefined();
  });
});
