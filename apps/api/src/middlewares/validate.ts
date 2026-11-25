import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { ValidationError } from '../errors/AppError.js';

interface ValidationSchemas {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        throw new ValidationError('Parâmetros de rota inválidos.', result.error.flatten());
      }
      req.params = result.data as Request['params'];
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        throw new ValidationError('Parâmetros de consulta inválidos.', result.error.flatten());
      }
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        throw new ValidationError('Dados de entrada inválidos.', result.error.flatten());
      }
      req.body = result.data;
    }

    next();
  };
}
