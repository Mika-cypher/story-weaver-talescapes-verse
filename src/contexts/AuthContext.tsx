import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User, Session } from '@supabase/supabase-js';

type UserRole = "user" | "admin";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
}

interface ExtendedUser extends User {
  username?: string;
}

type AuthContextType = {
  user: ExtendedUser | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  savedStories: string[];
  saveStory: (storyId: string) => void;
  unsaveStory: (storyId: string) => void;
  isStorySaved: (storyId: string) => boolean;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;
  likeContent: (contentId: string, contentType: string) => void;
  unlikeContent: (contentId: string, contentType: string) => void;
  isContentLiked: (contentId: string) => boolean;
  getUserSubmissions: () => any[];
  submitContent: (content: any) => Promise<boolean>;
  adminLogin: (password: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedStories, setSavedStories] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userWithUsername: ExtendedUser = currentSession.user;
          
          // This is a workaround to keep backward compatibility
          if (currentSession.user.user_metadata?.username) {
            userWithUsername.username = currentSession.user.user_metadata.username;
          }
          
          setUser(userWithUsername);
          
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const userWithUsername: ExtendedUser = currentSession.user;
        
        if (currentSession.user.user_metadata?.username) {
          userWithUsername.username = currentSession.user.user_metadata.username;
        }
        
        setUser(userWithUsername);
        fetchProfile(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Ensure role is set (default to "user" if not present)
      const profileWithRole: Profile = {
        ...data,
        role: data.role || "user"
      };
      
      setProfile(profileWithRole);
      
      // Set admin status based on role
      setIsAdmin(profileWithRole.role === "admin");
      
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setSavedStories([]);
      
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

      setProfile(prev => prev ? { ...prev, ...updates } : null);
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

  const adminLogin = (password: string): boolean => {
    // Simple admin login for demo purposes
    // In production, this should be handled securely
    if (password === "admin123") {
      setIsAdmin(true);
      toast({
        title: "Admin Access Granted",
        description: "You're now logged in as an admin.",
      });
      return true;
    }
    return false;
  };

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

  const isStorySaved = (storyId: string) => {
    return savedStories.includes(storyId);
  };
  
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
  
  const isFollowingUser = (userId: string) => {
    return following.includes(userId);
  };
  
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
  
  const isContentLiked = (contentId: string) => {
    return likedContent.some(id => id.includes(contentId));
  };
  
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
    
    // Also add to global submissions for admin to review
    const allSubmissions = localStorage.getItem(SUBMISSIONS_KEY) || "[]";
    const parsedSubmissions = JSON.parse(allSubmissions);
    parsedSubmissions.push(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(parsedSubmissions));
    
    return true;
  };

  const FOLLOWING_KEY = "talescapes_following";
  const LIKED_CONTENT_KEY = "talescapes_liked_content";
  const SUBMISSIONS_KEY = "talescapes_submissions";
  const MOCK_USERS_KEY = "talescapes_users";
  const SAVED_STORIES_KEY = "talescapes_saved_stories";
  const [likedContent, setLikedContent] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const savedStoriesData = localStorage.getItem(`${SAVED_STORIES_KEY}_${user.id}`);
      if (savedStoriesData) {
        setSavedStories(JSON.parse(savedStoriesData));
      }
      
      // Load liked content for the user
      const likedContentData = localStorage.getItem(`${LIKED_CONTENT_KEY}_${user.id}`);
      if (likedContentData) {
        setLikedContent(JSON.parse(likedContentData));
      }
      
      // Load following data for the user
      const followingData = localStorage.getItem(`${FOLLOWING_KEY}_${user.id}`);
      if (followingData) {
        setFollowing(JSON.parse(followingData));
      }
    }
  }, [user]);

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
