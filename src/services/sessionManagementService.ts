interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  interactions: number;
  device: string;
  browser: string;
  country?: string;
}

class SessionManagementService {
  private session: SessionData;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.session = this.initializeSession();
    this.setupActivityTracking();
    this.loadExistingSession();
  }

  private initializeSession(): SessionData {
    return {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      interactions: 0,
      device: this.getDeviceType(),
      browser: this.getBrowserInfo(),
    };
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private setupActivityTracking(): void {
    // Track user interactions
    ['click', 'keydown', 'scroll', 'mousemove'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.updateActivity();
      }, { passive: true });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });

    // Track page navigation
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private updateActivity(): void {
    this.session.lastActivity = Date.now();
    this.session.interactions++;
    this.resetInactivityTimer();
    this.saveSession();
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.handleInactivity();
    }, this.INACTIVITY_THRESHOLD);
  }

  private handleInactivity(): void {
    console.log('User inactive for 30 minutes');
    // Could trigger auto-save, logout, or other cleanup
  }

  private pauseSession(): void {
    this.saveSession();
  }

  private resumeSession(): void {
    this.session.lastActivity = Date.now();
    this.resetInactivityTimer();
  }

  private loadExistingSession(): void {
    try {
      const stored = localStorage.getItem('current_session');
      if (stored) {
        const storedSession = JSON.parse(stored);
        // Check if session is still valid (within 24 hours)
        if (Date.now() - storedSession.startTime < 24 * 60 * 60 * 1000) {
          this.session = { ...this.session, ...storedSession };
        }
      }
    } catch (error) {
      console.error('Failed to load existing session:', error);
    }
  }

  private saveSession(): void {
    try {
      localStorage.setItem('current_session', JSON.stringify(this.session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  setUserId(userId: string): void {
    this.session.userId = userId;
    this.saveSession();
  }

  trackPageView(): void {
    this.session.pageViews++;
    this.updateActivity();
  }

  getSession(): SessionData {
    return { ...this.session };
  }

  getSessionDuration(): number {
    return Date.now() - this.session.startTime;
  }

  endSession(): void {
    // Save final session data
    const finalSession = {
      ...this.session,
      endTime: Date.now(),
      duration: this.getSessionDuration(),
    };

    try {
      const sessionHistory = JSON.parse(localStorage.getItem('session_history') || '[]');
      sessionHistory.push(finalSession);
      // Keep only last 10 sessions
      localStorage.setItem('session_history', JSON.stringify(sessionHistory.slice(-10)));
      localStorage.removeItem('current_session');
    } catch (error) {
      console.error('Failed to save session history:', error);
    }
  }
}

export const sessionManagementService = new SessionManagementService();
