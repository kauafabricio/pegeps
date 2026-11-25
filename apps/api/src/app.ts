import path from 'node:path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { buildContainer } from './container.js';
import { NotFoundError } from './errors/AppError.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { createApiRouter } from './routes/index.js';

export function createApp(): Express {
  const app = express();
  const container = buildContainer();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '10kb' }));

  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
  app.use('/api', createApiRouter(container));

  app.use((_req, _res, next) => {
    next(new NotFoundError('Rota não encontrada.', 'ROUTE_NOT_FOUND'));
  });

  app.use(errorHandler);

  return app;
}
