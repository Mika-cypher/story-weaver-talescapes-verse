
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import Community from "@/pages/Community";
import Archive from "@/pages/Archive";
import Create from "@/pages/Create";
import CreateStudio from "@/pages/CreateStudio";
import Library from "@/pages/Library";
import Story from "@/pages/Story";
import StoryPreview from "@/pages/StoryPreview";
import ContentDetail from "@/pages/ContentDetail";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import Submit from "@/pages/Submit";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import AdminStories from "@/pages/AdminStories";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { UserProtectedRoute } from "@/components/user/UserProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/community" element={<Community />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/create" element={<Create />} />
      <Route path="/create-studio" element={<CreateStudio />} />
      <Route path="/library" element={<Library />} />
      <Route path="/story/:id" element={<Story />} />
      <Route path="/story/:id/preview" element={<StoryPreview />} />
      <Route path="/content/:type/:id" element={<ContentDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/stories" element={<ProtectedRoute><AdminStories /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
