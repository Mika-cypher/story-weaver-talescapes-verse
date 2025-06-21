
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { performanceMonitoringService } from "@/services/performanceMonitoringService";
import { AppInitializer } from "./AppInitializer";

// Root component that wraps the application
export const Root = () => {
  useEffect(() => {
    // Phase 3: Advanced performance monitoring
    const measureRender = performanceMonitoringService.recordMetric.bind(
      performanceMonitoringService,
      'root_component_render',
      performance.now()
    );
    
    return () => measureRender();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppInitializer />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};
