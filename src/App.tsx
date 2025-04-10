
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import NotFound from "./pages/NotFound";
import React from "react";

// Create a new QueryClient for tanstack query
const queryClient = new QueryClient();

// Create a separate component for routes with AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes>
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Root component that wraps the application
const Root = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

// Main App component
const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Root />
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
