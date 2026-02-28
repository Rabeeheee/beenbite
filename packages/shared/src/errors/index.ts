// ============================================
// Custom Error Classes - BeenBite Platform
// ============================================

import { StatusCodes } from 'http-status-codes';

export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST') {
    super(message, StatusCodes.BAD_REQUEST, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, StatusCodes.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(message, StatusCodes.FORBIDDEN, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, StatusCodes.NOT_FOUND, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists', code = 'CONFLICT') {
    super(message, StatusCodes.CONFLICT, code);
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(
    message = 'Validation failed',
    errors: Record<string, string[]> = {},
    code = 'VALIDATION_ERROR'
  ) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, code);
    this.errors = errors;
  }
}

export class PaymentError extends AppError {
  constructor(message = 'Payment processing failed', code = 'PAYMENT_ERROR') {
    super(message, StatusCodes.PAYMENT_REQUIRED, code);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', code = 'RATE_LIMIT_EXCEEDED') {
    super(message, StatusCodes.TOO_MANY_REQUESTS, code);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = 'Internal server error',
    code = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, code, false);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(
    message = 'Service temporarily unavailable',
    code = 'SERVICE_UNAVAILABLE'
  ) {
    super(message, StatusCodes.SERVICE_UNAVAILABLE, code);
  }
}
