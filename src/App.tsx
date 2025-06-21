
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { performanceMonitoringService } from "@/services/performanceMonitoringService";
import { Root } from "@/components/app/Root";
import { queryClient } from "@/config/queryClient";
import React, { useEffect } from "react";

// Main App component
function App() {
  useEffect(() => {
    // Phase 3: App-level performance tracking
    const appStartTime = performance.now();
    
    return () => {
      performanceMonitoringService.recordMetric('app_total_render_time', performance.now() - appStartTime);
    };
  }, []);

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
