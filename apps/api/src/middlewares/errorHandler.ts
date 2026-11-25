import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

interface MongoServerErrorLike {
  code?: number;
  keyPattern?: Record<string, unknown>;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos.',
        details: err.flatten(),
      },
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'A imagem deve ter no máximo 2MB.'
        : 'Falha ao processar o arquivo enviado.';
    res.status(400).json({
      error: {
        code: 'UPLOAD_ERROR',
        message,
      },
    });
    return;
  }

  const mongoErr = err as MongoServerErrorLike | undefined;
  if (mongoErr && mongoErr.code === 11000) {
    res.status(409).json({
      error: {
        code: 'DUPLICATE_KEY',
        message: 'Registro duplicado.',
      },
    });
    return;
  }

  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ocorreu um erro interno. Tente novamente em instantes.',
    },
  });
}
