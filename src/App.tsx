
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { UserProtectedRoute } from "@/components/user/UserProtectedRoute";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";
import Story from "./pages/Story";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStories from "./pages/AdminStories";
import { StoryEditor } from "./components/admin/StoryEditor";
import StoryPreview from "./pages/StoryPreview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

// Create a new QueryClient for tanstack query
const queryClient = new QueryClient();

// Create a separate component for routes with AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
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
  );
};

// Root component that wraps the application with necessary providers
const Root = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Root />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
