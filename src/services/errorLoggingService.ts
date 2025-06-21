import { betaAnalyticsService } from './betaAnalyticsService';

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  context: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

class ErrorLoggingService {
  private errors: ErrorLog[] = [];
  private maxErrors = 100; // Keep last 100 errors

  constructor() {
    this.setupGlobalErrorHandlers();
    this.loadStoredErrors();
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(
        new Error(event.message),
        'global_error',
        'high',
        ['unhandled', 'javascript']
      );
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        new Error(event.reason),
        'unhandled_promise_rejection',
        'medium',
        ['unhandled', 'promise']
      );
    });

    // Handle React error boundaries (this would be called from ErrorBoundary)
    window.addEventListener('react-error', ((event: CustomEvent) => {
      this.logError(
        event.detail.error,
        event.detail.context || 'react_component',
        'high',
        ['react', 'component']
      );
    }) as EventListener);
  }

  private loadStoredErrors(): void {
    try {
      const stored = localStorage.getItem('error_logs');
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load stored errors:', error);
    }
  }

  private saveErrors(): void {
    try {
      // Keep only the most recent errors
      const errorsToSave = this.errors.slice(-this.maxErrors);
      localStorage.setItem('error_logs', JSON.stringify(errorsToSave));
    } catch (error) {
      console.error('Failed to save errors:', error);
    }
  }

  logError(
    error: Error,
    context: string,
    severity: ErrorLog['severity'] = 'medium',
    tags: string[] = [],
    userId?: string
  ): void {
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId,
      severity,
      tags,
    };

    this.errors.push(errorLog);
    this.saveErrors();

    // Also track in analytics
    betaAnalyticsService.trackError(error, context, userId);

    // Log to console for development
    console.error('Error logged:', errorLog);

    // In a production environment, you might want to send critical errors to a service
    if (severity === 'critical') {
      this.handleCriticalError(errorLog);
    }
  }

  private handleCriticalError(errorLog: ErrorLog): void {
    // For beta, just log to console. In production, this could send to monitoring service
    console.error('CRITICAL ERROR:', errorLog);
    
    // Could show user notification for critical errors
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Critical Error Detected', {
        body: 'A critical error has been logged and reported.',
        icon: '/favicon.ico',
      });
    }
  }

  getErrors(limit?: number): ErrorLog[] {
    const errors = this.errors.slice().reverse(); // Most recent first
    return limit ? errors.slice(0, limit) : errors;
  }

  getErrorsByContext(context: string): ErrorLog[] {
    return this.errors.filter(error => error.context === context);
  }

  getErrorsBySeverity(severity: ErrorLog['severity']): ErrorLog[] {
    return this.errors.filter(error => error.severity === severity);
  }

  clearErrors(): void {
    this.errors = [];
    localStorage.removeItem('error_logs');
  }

  getErrorStats(): { total: number; bySeverity: Record<string, number> } {
    const bySeverity: Record<string, number> = {};
    this.errors.forEach(error => {
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    });

    return {
      total: this.errors.length,
      bySeverity,
    };
  }
}

export const errorLoggingService = new ErrorLoggingService();

// Helper function for manual error logging
export const logError = (
  error: Error,
  context: string,
  severity: ErrorLog['severity'] = 'medium',
  tags: string[] = []
) => {
  errorLoggingService.logError(error, context, severity, tags);
};
