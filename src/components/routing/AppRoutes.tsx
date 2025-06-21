
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { UserProtectedRoute } from "@/components/user/UserProtectedRoute";
import { RouteLoading } from "./RouteLoading";
import React from "react";

// Lazy load route components for better performance
const Index = React.lazy(() => import("@/pages/Index"));
const Explore = React.lazy(() => import("@/pages/Explore"));
const Create = React.lazy(() => import("@/pages/Create"));
const Submit = React.lazy(() => import("@/pages/Submit"));
const Archive = React.lazy(() => import("@/pages/Archive"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const Story = React.lazy(() => import("@/pages/Story"));
const AdminLogin = React.lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));
const AdminStories = React.lazy(() => import("@/pages/AdminStories"));
const StoryEditor = React.lazy(() => import("@/components/admin/StoryEditor").then(module => ({ default: module.StoryEditor })));
const StoryPreview = React.lazy(() => import("@/pages/StoryPreview"));
const Login = React.lazy(() => import("@/pages/Login"));
const Signup = React.lazy(() => import("@/pages/Signup"));
const ResetPassword = React.lazy(() => import("@/pages/ResetPassword"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const ContentDetail = React.lazy(() => import("@/pages/ContentDetail"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoading />}>
      <main id="main-content">
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
          
          {/* Cultural Heritage Detail Routes */}
          <Route path="/archive/:type/:id" element={<ContentDetail />} />
          
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
      </main>
    </Suspense>
  );
};
