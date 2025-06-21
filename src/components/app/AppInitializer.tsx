
import { useEffect, useState } from "react";
import { betaAnalyticsService } from "@/services/betaAnalyticsService";
import { featureToggleService } from "@/services/featureToggleService";
import { performanceMonitoringService } from "@/services/performanceMonitoringService";
import { sessionManagementService } from "@/services/sessionManagementService";
import { accessibilityService } from "@/services/accessibilityService";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import { AppRoutes } from "@/components/routing/AppRoutes";

export const AppInitializer = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Phase 3: Enhanced initialization
    console.log('Phase 3 services initialized');
    
    // Initialize accessibility features
    accessibilityService.addSkipLink('main-content', 'Skip to main content');
    
    // Track initial page load performance
    performanceMonitoringService.recordMetric('app_initialization', performance.now());
    
    // Check if user is new (hasn't seen onboarding before)
    const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('has_seen_onboarding', 'true');
    setShowOnboarding(false);
    
    // Track onboarding completion
    betaAnalyticsService.trackFeatureUsage('onboarding_completed');
    performanceMonitoringService.recordMetric('onboarding_completion_time', performance.now());
  };

  // Track page views and performance
  useEffect(() => {
    const trackPageView = () => {
      const pageName = window.location.pathname;
      betaAnalyticsService.trackPageView(pageName);
      sessionManagementService.trackPageView();
      
      // Measure page navigation performance
      performanceMonitoringService.recordMetric(`page_navigation_${pageName}`, performance.now());
    };

    trackPageView();
    window.addEventListener('popstate', trackPageView);
    return () => window.removeEventListener('popstate', trackPageView);
  }, []);

  return (
    <>
      <AppRoutes />
      
      {/* Phase 3 Beta Features */}
      {featureToggleService.isEnabled('real_time_feedback') && <FeedbackButton />}
      <OnboardingFlow open={showOnboarding} onComplete={handleOnboardingComplete} />
    </>
  );
};
