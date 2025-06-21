
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface PageLoadMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  domContentLoaded: number;
  loadComplete: number;
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.setupPerformanceObserver();
    this.measurePageLoad();
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration || entry.startTime);
        }
      });

      try {
        this.observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
      } catch (error) {
        console.warn('Performance observer setup failed:', error);
      }
    }
  }

  private measurePageLoad(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        const metrics: PageLoadMetrics = {
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          largestContentfulPaint: 0,
          firstInputDelay: 0,
          cumulativeLayoutShift: 0,
          timeToInteractive: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        };

        Object.entries(metrics).forEach(([name, value]) => {
          this.recordMetric(`page_load_${name}`, value);
        });
      }, 0);
    });
  }

  recordMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(metric);
    this.saveMetrics();

    // Log slow operations
    if (value > 1000) {
      console.warn(`Slow operation detected: ${name} took ${value}ms`);
    }
  }

  private saveMetrics(): void {
    try {
      const recentMetrics = this.metrics.slice(-50); // Keep last 50 metrics
      localStorage.setItem('performance_metrics', JSON.stringify(recentMetrics));
    } catch (error) {
      console.error('Failed to save performance metrics:', error);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  getAverageMetric(name: string): number {
    const matchingMetrics = this.metrics.filter(m => m.name === name);
    if (matchingMetrics.length === 0) return 0;
    
    const sum = matchingMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / matchingMetrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
    localStorage.removeItem('performance_metrics');
  }
}

export const performanceMonitoringService = new PerformanceMonitoringService();

// Helper function to measure component render time
export const measureComponentRender = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    performanceMonitoringService.recordMetric(`component_render_${componentName}`, endTime - startTime);
  };
};
