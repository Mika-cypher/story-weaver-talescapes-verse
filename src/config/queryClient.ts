
import { QueryClient } from "@tanstack/react-query";

// Create a new QueryClient for tanstack query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
