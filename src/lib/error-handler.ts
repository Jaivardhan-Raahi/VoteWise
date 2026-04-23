/**
 * Centralized Error Handling System
 * Standardizes error reporting, logging, and user-facing messages.
 */

export enum ErrorCategory {
  FIREBASE = "FIREBASE",
  GEMINI = "GEMINI",
  VALIDATION = "VALIDATION",
  INTERNAL = "INTERNAL",
}

export class AppError extends Error {
  constructor(
    public category: ErrorCategory,
    public message: string,
    public originalError?: any,
    public isSilent: boolean = false
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = {
  log(error: AppError | Error | any) {
    const isAppError = error instanceof AppError;
    const category = isAppError ? error.category : ErrorCategory.INTERNAL;
    
    // In production, this would send to a logging service like Sentry or Google Cloud Logging
    console.error(`[${category}] ${error.message}`, {
      stack: error.stack,
      original: isAppError ? error.originalError : error,
    });
  },

  handle(category: ErrorCategory, message: string, originalError?: any): string {
    const error = new AppError(category, message, originalError);
    this.log(error);
    
    // Standardized user-facing messages
    switch (category) {
      case ErrorCategory.FIREBASE:
        return "Connectivity issue with our data service. Please try again later.";
      case ErrorCategory.GEMINI:
        return "AI analysis is temporarily unavailable. The core results are still accurate.";
      case ErrorCategory.VALIDATION:
        return `Input error: ${message}`;
      default:
        return "An unexpected error occurred. We are looking into it.";
    }
  }
};
