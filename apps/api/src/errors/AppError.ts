export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Dados inválidos.', details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Autenticação necessária.', code = 'UNAUTHORIZED') {
    super(401, code, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Você não tem permissão para acessar este recurso.', code = 'FORBIDDEN') {
    super(403, code, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado.', code = 'NOT_FOUND') {
    super(404, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito ao processar a requisição.', code = 'CONFLICT', details?: unknown) {
    super(409, code, message, details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(
    message = 'Muitas requisições. Tente novamente mais tarde.',
    code = 'TOO_MANY_REQUESTS',
    details?: unknown,
  ) {
    super(429, code, message, details);
  }
}

export class BadGatewayError extends AppError {
  constructor(
    message = 'Não foi possível comunicar com o serviço externo. Tente novamente.',
    code = 'BAD_GATEWAY',
  ) {
    super(502, code, message);
  }
}
