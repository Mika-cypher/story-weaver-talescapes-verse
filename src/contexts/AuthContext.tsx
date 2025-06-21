
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { authService, AuthError } from "@/services/authService";
import { socialService, SocialError } from "@/services/socialService";
import { submissionService, SubmissionError } from "@/services/submissionService";

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    setFollowing,
    isLoading,
    error: authError
  } = useAuthState();

  // Authentication methods
  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/");
    } catch (error: any) {
      if (error instanceof AuthError) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      await authService.signup(username, email, password);
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      navigate("/");
    } catch (error: any) {
      if (error instanceof AuthError) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: error instanceof AuthError ? error.message : "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<typeof profile>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    try {
      await authService.updateProfile(user.id, updates);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error instanceof AuthError ? error.message : "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Social features - integrated with socialService
  const saveStory = async (storyId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save stories",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedSavedStories = await socialService.saveStory(user.id, storyId, savedStories);
      setSavedStories(updatedSavedStories);
      
      toast({
        title: "Story saved",
        description: "This story has been added to your saved stories",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof SocialError ? error.message : "Could not save story",
        variant: "destructive",
      });
    }
  };

  const unsaveStory = async (storyId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to manage saved stories",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedSavedStories = await socialService.unsaveStory(user.id, storyId, savedStories);
      setSavedStories(updatedSavedStories);
      
      toast({
        title: "Story removed",
        description: "This story has been removed from your saved stories",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof SocialError ? error.message : "Could not remove story",
        variant: "destructive",
      });
    }
  };

  const followUser = (userId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to follow users",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedFollowing = socialService.followUser(user.id, userId, following);
      setFollowing(updatedFollowing);
      
      toast({
        title: "User followed",
        description: "You are now following this user",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof SocialError ? error.message : "Could not follow user",
        variant: "destructive",
      });
    }
  };
  
  const unfollowUser = (userId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to unfollow users",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedFollowing = socialService.unfollowUser(user.id, userId, following);
      setFollowing(updatedFollowing);
      
      toast({
        title: "User unfollowed",
        description: "You are no longer following this user",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof SocialError ? error.message : "Could not unfollow user",
        variant: "destructive",
      });
    }
  };
  
  const likeContent = (contentId: string, contentType: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to like content",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedLikedContent = socialService.likeContent(user.id, contentId, contentType, likedContent);
      setLikedContent(updatedLikedContent);
      
      toast({
        title: "Content liked",
        description: "You have liked this content",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof SocialError ? error.message : "Could not like content",
        variant: "destructive",
      });
    }
  };
  
  const unlikeContent = (contentId: string, contentType: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to unlike content",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedLikedContent = socialService.unlikeContent(user.id, contentId, contentType, likedContent);
      setLikedContent(updatedLikedContent);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof SocialError ? error.message : "Could not unlike content",
        variant: "destructive",
      });
    }
  };

  // Display loading state or errors
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading authentication...</p>
      </div>
    </div>;
  }

  if (authError) {
    return <div className="max-w-md mx-auto mt-8 px-4">
      <Alert variant="destructive">
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          {authError}
          <button 
            onClick={() => window.location.reload()}
            className="block mt-2 underline"
          >
            Try refreshing the page
          </button>
        </AlertDescription>
      </Alert>
    </div>;
  }

  // Content submission functions
  const getUserSubmissions = async (): Promise<any[]> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to access your submissions",
        variant: "destructive",
      });
      return [];
    }
    
    try {
      return await submissionService.getUserSubmissions(user.id);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return [];
    }
  };
  
  const submitContent = async (content: any): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit content",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const result = await submissionService.submitContent(user.id, user.username || 'user', content);
      
      toast({
        title: "Submission Received",
        description: "Your content has been submitted for review",
      });
      
      return result;
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error instanceof SubmissionError ? error.message : "Could not submit content",
        variant: "destructive",
      });
      return false;
    }
  };

  const adminLogin = (password: string): boolean => {
    try {
      return authService.adminLogin(password);
    } catch (error: any) {
      toast({
        title: "Access Denied",
        description: error instanceof AuthError ? error.message : "Invalid admin password",
        variant: "destructive",
      });
      return false;
    }
  };

  // Create context value
  const contextValue: AuthContextType = {
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
    isStorySaved: (storyId: string) => socialService.isStorySaved(storyId, savedStories),
    followUser,
    unfollowUser,
    isFollowingUser: (userId: string) => socialService.isFollowingUser(userId, following),
    likeContent,
    unlikeContent,
    isContentLiked: (contentId: string) => socialService.isContentLiked(contentId, likedContent),
    getUserSubmissions,
    submitContent,
    adminLogin
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
