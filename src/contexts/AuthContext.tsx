
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType, Profile } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FOLLOWING_KEY = "talescapes_following";
const LIKED_CONTENT_KEY = "talescapes_liked_content";
const SUBMISSIONS_KEY = "talescapes_submissions";
const MOCK_USERS_KEY = "talescapes_users";
const SAVED_STORIES_KEY = "talescapes_saved_stories";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    user,
    session,
    profile,
    isAdmin,
    savedStories,
    setSavedStories,
    likedContent,
    setLikedContent,
    following,
    setFollowing
  } = useAuthState();

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Social features handlers
  const saveStory = (storyId: string) => {
    if (!user) return;
    
    if (!savedStories.includes(storyId)) {
      const updatedSavedStories = [...savedStories, storyId];
      setSavedStories(updatedSavedStories);
      localStorage.setItem(`${SAVED_STORIES_KEY}_${user.id}`, JSON.stringify(updatedSavedStories));
      
      toast({
        title: "Story saved",
        description: "This story has been added to your saved stories",
      });
    }
  };

  const unsaveStory = (storyId: string) => {
    if (!user) return;
    
    const updatedSavedStories = savedStories.filter(id => id !== storyId);
    setSavedStories(updatedSavedStories);
    localStorage.setItem(`${SAVED_STORIES_KEY}_${user.id}`, JSON.stringify(updatedSavedStories));
    
    toast({
      title: "Story removed",
      description: "This story has been removed from your saved stories",
    });
  };

  const isStorySaved = (storyId: string) => savedStories.includes(storyId);
  
  const followUser = (userId: string) => {
    if (!user) return;
    
    if (!following.includes(userId)) {
      const updatedFollowing = [...following, userId];
      setFollowing(updatedFollowing);
      localStorage.setItem(`${FOLLOWING_KEY}_${user.id}`, JSON.stringify(updatedFollowing));
    }
  };
  
  const unfollowUser = (userId: string) => {
    if (!user) return;
    
    const updatedFollowing = following.filter(id => id !== userId);
    setFollowing(updatedFollowing);
    localStorage.setItem(`${FOLLOWING_KEY}_${user.id}`, JSON.stringify(updatedFollowing));
  };
  
  const isFollowingUser = (userId: string) => following.includes(userId);
  
  const likeContent = (contentId: string, contentType: string) => {
    if (!user) return;
    
    const likeId = `${contentType}_${contentId}`;
    if (!likedContent.includes(likeId)) {
      const updatedLikedContent = [...likedContent, likeId];
      setLikedContent(updatedLikedContent);
      localStorage.setItem(`${LIKED_CONTENT_KEY}_${user.id}`, JSON.stringify(updatedLikedContent));
    }
  };
  
  const unlikeContent = (contentId: string, contentType: string) => {
    if (!user) return;
    
    const likeId = `${contentType}_${contentId}`;
    const updatedLikedContent = likedContent.filter(id => id !== likeId);
    setLikedContent(updatedLikedContent);
    localStorage.setItem(`${LIKED_CONTENT_KEY}_${user.id}`, JSON.stringify(updatedLikedContent));
  };
  
  const isContentLiked = (contentId: string) => likedContent.some(id => id.includes(contentId));
  
  const getUserSubmissions = () => {
    if (!user) return [];
    
    const submissions = localStorage.getItem(`${SUBMISSIONS_KEY}_${user.id}`);
    return submissions ? JSON.parse(submissions) : [];
  };
  
  const submitContent = async (content: any): Promise<boolean> => {
    if (!user) return false;
    
    const submission = {
      ...content,
      id: `sub_${Date.now()}`,
      userId: user.id,
      userName: user.username,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    
    const userSubmissions = getUserSubmissions();
    const updatedSubmissions = [...userSubmissions, submission];
    
    localStorage.setItem(`${SUBMISSIONS_KEY}_${user.id}`, JSON.stringify(updatedSubmissions));
    
    const allSubmissions = localStorage.getItem(SUBMISSIONS_KEY) || "[]";
    const parsedSubmissions = JSON.parse(allSubmissions);
    parsedSubmissions.push(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(parsedSubmissions));
    
    return true;
  };

  const adminLogin = (password: string): boolean => {
    if (password === "admin123") {
      toast({
        title: "Admin Access Granted",
        description: "You're now logged in as an admin.",
      });
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        updateProfile,
        savedStories,
        saveStory,
        unsaveStory,
        isStorySaved,
        followUser,
        unfollowUser,
        isFollowingUser,
        likeContent,
        unlikeContent,
        isContentLiked,
        getUserSubmissions,
        submitContent,
        adminLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
