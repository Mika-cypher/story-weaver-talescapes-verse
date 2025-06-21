
interface BetaAnalyticsEvent {
  id: string;
  eventType: 'page_view' | 'story_start' | 'story_complete' | 'feature_used' | 'error_occurred' | 'feedback_submitted';
  eventData: Record<string, any>;
  timestamp: string;
  sessionId: string;
  userId?: string;
  url: string;
  userAgent: string;
}

class BetaAnalyticsService {
  private sessionId: string;
  private events: BetaAnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadStoredEvents();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem('beta_analytics');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load stored analytics:', error);
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem('beta_analytics', JSON.stringify(this.events));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  track(eventType: BetaAnalyticsEvent['eventType'], eventData: Record<string, any> = {}, userId?: string): void {
    const event: BetaAnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      eventType,
      eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.events.push(event);
    this.saveEvents();

    // Log for debugging in beta
    console.log('Beta Analytics:', event);
  }

  trackPageView(pageName: string, userId?: string): void {
    this.track('page_view', { pageName }, userId);
  }

  trackStoryStart(storyId: string, storyTitle: string, userId?: string): void {
    this.track('story_start', { storyId, storyTitle }, userId);
  }

  trackStoryComplete(storyId: string, storyTitle: string, completionTime: number, userId?: string): void {
    this.track('story_complete', { storyId, storyTitle, completionTime }, userId);
  }

  trackFeatureUsage(featureName: string, details: Record<string, any> = {}, userId?: string): void {
    this.track('feature_used', { featureName, ...details }, userId);
  }

  trackError(error: Error, context: string, userId?: string): void {
    this.track('error_occurred', {
      message: error.message,
      stack: error.stack,
      context,
    }, userId);
  }

  trackFeedback(feedbackType: string, feedbackLength: number, userId?: string): void {
    this.track('feedback_submitted', { feedbackType, feedbackLength }, userId);
  }

  getSessionEvents(): BetaAnalyticsEvent[] {
    return this.events.filter(event => event.sessionId === this.sessionId);
  }

  getAllEvents(): BetaAnalyticsEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
    localStorage.removeItem('beta_analytics');
  }
}

export const betaAnalyticsService = new BetaAnalyticsService();
