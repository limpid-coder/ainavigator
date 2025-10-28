// Error handling service

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export function handleError(error: any): AppError {
  if (error instanceof AppError) {
    return error
  }
  
  return new AppError(
    error.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500
  )
}

