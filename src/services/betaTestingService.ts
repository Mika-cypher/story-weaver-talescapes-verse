
interface ABTest {
  id: string;
  name: string;
  variants: string[];
  activeVariant?: string;
  startDate: string;
  endDate?: string;
  enabled: boolean;
}

interface BetaUser {
  id: string;
  email: string;
  joinDate: string;
  testGroups: string[];
  feedback: number;
  bugReports: number;
  lastActive: string;
}

class BetaTestingService {
  private activeTests: Map<string, ABTest> = new Map();
  private userVariants: Map<string, string> = new Map();

  constructor() {
    this.initializeTests();
    this.loadUserVariants();
  }

  private initializeTests(): void {
    const defaultTests: ABTest[] = [
      {
        id: 'onboarding_flow',
        name: 'Onboarding Flow Test',
        variants: ['standard', 'interactive', 'minimal'],
        enabled: true,
        startDate: new Date().toISOString(),
      },
      {
        id: 'story_card_layout',
        name: 'Story Card Layout Test',
        variants: ['grid', 'list', 'masonry'],
        enabled: true,
        startDate: new Date().toISOString(),
      },
      {
        id: 'navigation_style',
        name: 'Navigation Style Test',
        variants: ['sidebar', 'topbar', 'floating'],
        enabled: false,
        startDate: new Date().toISOString(),
      },
    ];

    defaultTests.forEach(test => {
      this.activeTests.set(test.id, test);
    });
  }

  private loadUserVariants(): void {
    try {
      const stored = localStorage.getItem('ab_test_variants');
      if (stored) {
        const variants = JSON.parse(stored);
        Object.entries(variants).forEach(([testId, variant]) => {
          this.userVariants.set(testId, variant as string);
        });
      }
    } catch (error) {
      console.error('Failed to load A/B test variants:', error);
    }
  }

  private saveUserVariants(): void {
    try {
      const variants: Record<string, string> = {};
      this.userVariants.forEach((variant, testId) => {
        variants[testId] = variant;
      });
      localStorage.setItem('ab_test_variants', JSON.stringify(variants));
    } catch (error) {
      console.error('Failed to save A/B test variants:', error);
    }
  }

  getVariant(testId: string): string | null {
    const test = this.activeTests.get(testId);
    if (!test || !test.enabled) return null;

    // Check if user already has a variant assigned
    if (this.userVariants.has(testId)) {
      return this.userVariants.get(testId)!;
    }

    // Assign random variant
    const randomIndex = Math.floor(Math.random() * test.variants.length);
    const variant = test.variants[randomIndex];
    
    this.userVariants.set(testId, variant);
    this.saveUserVariants();
    
    return variant;
  }

  trackConversion(testId: string, conversionType: string): void {
    const variant = this.getVariant(testId);
    if (!variant) return;

    // Store conversion data
    const conversion = {
      testId,
      variant,
      conversionType,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    try {
      const conversions = JSON.parse(localStorage.getItem('ab_conversions') || '[]');
      conversions.push(conversion);
      localStorage.setItem('ab_conversions', JSON.stringify(conversions.slice(-100)));
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  }

  getBetaUserStats(): BetaUser | null {
    try {
      const stored = localStorage.getItem('beta_user_stats');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load beta user stats:', error);
      return null;
    }
  }

  updateBetaUserStats(updates: Partial<BetaUser>): void {
    try {
      const current = this.getBetaUserStats() || {
        id: '',
        email: '',
        joinDate: new Date().toISOString(),
        testGroups: [],
        feedback: 0,
        bugReports: 0,
        lastActive: new Date().toISOString(),
      };

      const updated = { ...current, ...updates, lastActive: new Date().toISOString() };
      localStorage.setItem('beta_user_stats', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update beta user stats:', error);
    }
  }

  getActiveTests(): ABTest[] {
    return Array.from(this.activeTests.values()).filter(test => test.enabled);
  }

  getUserTestVariants(): Record<string, string> {
    const variants: Record<string, string> = {};
    this.userVariants.forEach((variant, testId) => {
      variants[testId] = variant;
    });
    return variants;
  }
}

export const betaTestingService = new BetaTestingService();

// Hook for easy A/B testing in components
export const useABTest = (testId: string) => {
  const variant = betaTestingService.getVariant(testId);
  
  const trackConversion = (conversionType: string) => {
    betaTestingService.trackConversion(testId, conversionType);
  };

  return { variant, trackConversion };
};
