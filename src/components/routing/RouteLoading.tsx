
import { LoadingSpinner } from "@/components/common/LoadingStates";

// Loading component for route transitions
export const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);
