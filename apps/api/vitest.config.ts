import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/pegeps_test',
      JWT_SECRET: 'test-jwt-secret-with-at-least-32-characters-1234',
      CLIENT_ORIGIN: 'http://localhost:3000',
    },
  },
});
