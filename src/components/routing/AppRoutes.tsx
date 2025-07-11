import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Explore from '@/pages/Explore';
import Story from '@/pages/Story';
import Create from '@/pages/Create';
import CreateStudio from '@/pages/CreateStudio';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import Archive from '@/pages/Archive';
import Submit from '@/pages/Submit';
import Library from '@/pages/Library';
import NotFound from '@/pages/NotFound';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminStories from '@/pages/AdminStories';
import StoryPreview from '@/pages/StoryPreview';
import ContentDetail from '@/pages/ContentDetail';
import { StoryEditor } from '@/components/admin/StoryEditor';
import { CollaborativeEditor } from '@/components/story/CollaborativeEditor';
import Community from "@/pages/Community";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/story/:id" element={<Story />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/content/:type/:id" element={<ContentDetail />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* User Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<Create />} />
      <Route path="/create-studio" element={<CreateStudio />} />
      <Route path="/collaborate/:id" element={<CollaborativeEditor />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/library" element={<Library />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/stories" element={<AdminStories />} />
      <Route path="/admin/stories/:id/edit" element={<StoryEditor />} />
      <Route path="/admin/stories/:id/preview" element={<StoryPreview />} />
      
      {/* Community Routes */}
      <Route path="/community" element={<Community />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
