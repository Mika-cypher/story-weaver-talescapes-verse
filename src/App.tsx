
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { UserProtectedRoute } from "@/components/user/UserProtectedRoute";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingStates";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { betaAnalyticsService } from "@/services/betaAnalyticsService";
import { featureToggleService } from "@/services/featureToggleService";
import React, { Suspense, useEffect, useState } from "react";

// Lazy load route components for better performance
const Index = React.lazy(() => import("./pages/Index"));
const Explore = React.lazy(() => import("./pages/Explore"));
const Create = React.lazy(() => import("./pages/Create"));
const Submit = React.lazy(() => import("./pages/Submit"));
const Archive = React.lazy(() => import("./pages/Archive"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Story = React.lazy(() => import("./pages/Story"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const AdminStories = React.lazy(() => import("./pages/AdminStories"));
const StoryEditor = React.lazy(() => import("./components/admin/StoryEditor").then(module => ({ default: module.StoryEditor })));
const StoryPreview = React.lazy(() => import("./pages/StoryPreview"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Profile = React.lazy(() => import("./pages/Profile"));

// Create a new QueryClient for tanstack query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component for route transitions
const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

// Create a separate component for routes with AnimatePresence
const AnimatedRoutes = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
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
  };

  // Track page views
  useEffect(() => {
    const trackPageView = () => {
      const pageName = window.location.pathname;
      betaAnalyticsService.trackPageView(pageName);
    };

    trackPageView();
    window.addEventListener('popstate', trackPageView);
    return () => window.removeEventListener('popstate', trackPageView);
  }, []);

  return (
    <>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Index />
            </motion.div>
          } />
          <Route path="/explore" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Explore />
            </motion.div>
          } />
          <Route path="/create" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Create />
            </motion.div>
          } />
          <Route path="/submit" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Submit />
            </motion.div>
          } />
          <Route path="/archive" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Archive />
            </motion.div>
          } />
          <Route path="/story/:id" element={<Story />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* User Protected Routes */}
          <Route path="/profile" element={
            <UserProtectedRoute>
              <Profile />
            </UserProtectedRoute>
          } />
          <Route path="/profile/:username" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/stories" element={
            <ProtectedRoute>
              <AdminStories />
            </ProtectedRoute>
          } />
          <Route path="/admin/stories/new" element={
            <ProtectedRoute>
              <StoryEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/stories/:id/edit" element={
            <ProtectedRoute>
              <StoryEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/stories/:id/preview" element={
            <ProtectedRoute>
              <StoryPreview />
            </ProtectedRoute>
          } />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Beta Features */}
      {featureToggleService.isEnabled('real_time_feedback') && <FeedbackButton />}
      <OnboardingFlow open={showOnboarding} onComplete={handleOnboardingComplete} />
    </>
  );
};

// Root component that wraps the application
const Root = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

// Main App component
function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Root />
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
