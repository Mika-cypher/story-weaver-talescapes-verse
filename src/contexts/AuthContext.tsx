import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { authService, AuthError } from "@/services/authService";

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const FOLLOWING_KEY = "talescapes_following";
const LIKED_CONTENT_KEY = "talescapes_liked_content";
const SUBMISSIONS_KEY = "talescapes_submissions";
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

  // Social features handlers
  const saveStory = (storyId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save stories",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!storyId) {
        throw new Error("Invalid story ID");
      }
      
      if (!savedStories.includes(storyId)) {
        const updatedSavedStories = [...savedStories, storyId];
        setSavedStories(updatedSavedStories);
        localStorage.setItem(`${SAVED_STORIES_KEY}_${user.id}`, JSON.stringify(updatedSavedStories));
        
        toast({
          title: "Story saved",
          description: "This story has been added to your saved stories",
        });
      } else {
        toast({
          title: "Already Saved",
          description: "This story is already in your saved collection",
        });
      }
    } catch (error: any) {
      console.error("Error saving story:", error);
      toast({
        title: "Error",
        description: `Could not save story: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const unsaveStory = (storyId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to manage saved stories",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!storyId) {
        throw new Error("Invalid story ID");
      }
      
      const updatedSavedStories = savedStories.filter(id => id !== storyId);
      setSavedStories(updatedSavedStories);
      localStorage.setItem(`${SAVED_STORIES_KEY}_${user.id}`, JSON.stringify(updatedSavedStories));
      
      toast({
        title: "Story removed",
        description: "This story has been removed from your saved stories",
      });
    } catch (error: any) {
      console.error("Error removing saved story:", error);
      toast({
        title: "Error",
        description: `Could not remove story: ${error.message}`,
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
      if (!userId) {
        throw new Error("Invalid user ID");
      }
      
      if (userId === user.id) {
        toast({
          title: "Cannot follow yourself",
          description: "You cannot follow your own account",
          variant: "destructive",
        });
        return;
      }
      
      if (!following.includes(userId)) {
        const updatedFollowing = [...following, userId];
        setFollowing(updatedFollowing);
        localStorage.setItem(`${FOLLOWING_KEY}_${user.id}`, JSON.stringify(updatedFollowing));
        
        toast({
          title: "User followed",
          description: "You are now following this user",
        });
      } else {
        toast({
          title: "Already following",
          description: "You are already following this user",
        });
      }
    } catch (error: any) {
      console.error("Error following user:", error);
      toast({
        title: "Error",
        description: `Could not follow user: ${error.message}`,
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
      if (!userId) {
        throw new Error("Invalid user ID");
      }
      
      const updatedFollowing = following.filter(id => id !== userId);
      setFollowing(updatedFollowing);
      localStorage.setItem(`${FOLLOWING_KEY}_${user.id}`, JSON.stringify(updatedFollowing));
      
      toast({
        title: "User unfollowed",
        description: "You are no longer following this user",
      });
    } catch (error: any) {
      console.error("Error unfollowing user:", error);
      toast({
        title: "Error",
        description: `Could not unfollow user: ${error.message}`,
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
      if (!contentId || !contentType) {
        throw new Error("Invalid content information");
      }
      
      const likeId = `${contentType}_${contentId}`;
      if (!likedContent.includes(likeId)) {
        const updatedLikedContent = [...likedContent, likeId];
        setLikedContent(updatedLikedContent);
        localStorage.setItem(`${LIKED_CONTENT_KEY}_${user.id}`, JSON.stringify(updatedLikedContent));
        
        toast({
          title: "Content liked",
          description: "You have liked this content",
        });
      }
    } catch (error: any) {
      console.error("Error liking content:", error);
      toast({
        title: "Error",
        description: `Could not like content: ${error.message}`,
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
      if (!contentId || !contentType) {
        throw new Error("Invalid content information");
      }
      
      const likeId = `${contentType}_${contentId}`;
      const updatedLikedContent = likedContent.filter(id => id !== likeId);
      setLikedContent(updatedLikedContent);
      localStorage.setItem(`${LIKED_CONTENT_KEY}_${user.id}`, JSON.stringify(updatedLikedContent));
    } catch (error: any) {
      console.error("Error unliking content:", error);
      toast({
        title: "Error",
        description: `Could not unlike content: ${error.message}`,
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

  // Local user submission functions
  const getUserSubmissions = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to access your submissions",
        variant: "destructive",
      });
      return [];
    }
    
    try {
      const submissions = localStorage.getItem(`${SUBMISSIONS_KEY}_${user.id}`);
      return submissions ? JSON.parse(submissions) : [];
    } catch (error: any) {
      console.error("Error fetching user submissions:", error);
      toast({
        title: "Error",
        description: `Could not fetch your submissions: ${error.message}`,
        variant: "destructive",
      });
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
      // Validate content submission
      if (!content || typeof content !== 'object') {
        throw new Error("Invalid content format");
      }
      
      // Required fields validation
      const requiredFields = ['title', 'description'];
      for (const field of requiredFields) {
        if (!content[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
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
      
      toast({
        title: "Submission Received",
        description: "Your content has been submitted for review",
      });
      
      return true;
    } catch (error: any) {
      console.error("Content submission error:", error);
      toast({
        title: "Submission Failed",
        description: `Could not submit content: ${error.message}`,
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
    isStorySaved: (storyId: string) => savedStories.includes(storyId),
    followUser: (userId: string) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to follow users",
          variant: "destructive",
        });
        return;
      }
      
      try {
        if (!userId) {
          throw new Error("Invalid user ID");
        }
        
        if (userId === user.id) {
          toast({
            title: "Cannot follow yourself",
            description: "You cannot follow your own account",
            variant: "destructive",
          });
          return;
        }
        
        if (!following.includes(userId)) {
          const updatedFollowing = [...following, userId];
          setFollowing(updatedFollowing);
          localStorage.setItem(`${FOLLOWING_KEY}_${user.id}`, JSON.stringify(updatedFollowing));
          
          toast({
            title: "User followed",
            description: "You are now following this user",
          });
        } else {
          toast({
            title: "Already following",
            description: "You are already following this user",
          });
        }
      } catch (error: any) {
        console.error("Error following user:", error);
        toast({
          title: "Error",
          description: `Could not follow user: ${error.message}`,
          variant: "destructive",
        });
      }
    },
    unfollowUser: (userId: string) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to unfollow users",
          variant: "destructive",
        });
        return;
      }
      
      try {
        if (!userId) {
          throw new Error("Invalid user ID");
        }
        
        const updatedFollowing = following.filter(id => id !== userId);
        setFollowing(updatedFollowing);
        localStorage.setItem(`${FOLLOWING_KEY}_${user.id}`, JSON.stringify(updatedFollowing));
        
        toast({
          title: "User unfollowed",
          description: "You are no longer following this user",
        });
      } catch (error: any) {
        console.error("Error unfollowing user:", error);
        toast({
          title: "Error",
          description: `Could not unfollow user: ${error.message}`,
          variant: "destructive",
        });
      }
    },
    isFollowingUser: (userId: string) => following.includes(userId),
    likeContent: (contentId: string, contentType: string) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to like content",
          variant: "destructive",
        });
        return;
      }
      
      try {
        if (!contentId || !contentType) {
          throw new Error("Invalid content information");
        }
        
        const likeId = `${contentType}_${contentId}`;
        if (!likedContent.includes(likeId)) {
          const updatedLikedContent = [...likedContent, likeId];
          setLikedContent(updatedLikedContent);
          localStorage.setItem(`${LIKED_CONTENT_KEY}_${user.id}`, JSON.stringify(updatedLikedContent));
          
          toast({
            title: "Content liked",
            description: "You have liked this content",
          });
        }
      } catch (error: any) {
        console.error("Error liking content:", error);
        toast({
          title: "Error",
          description: `Could not like content: ${error.message}`,
          variant: "destructive",
        });
      }
    },
    unlikeContent: (contentId: string, contentType: string) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to unlike content",
          variant: "destructive",
        });
        return;
      }
      
      try {
        if (!contentId || !contentType) {
          throw new Error("Invalid content information");
        }
        
        const likeId = `${contentType}_${contentId}`;
        const updatedLikedContent = likedContent.filter(id => id !== likeId);
        setLikedContent(updatedLikedContent);
        localStorage.setItem(`${LIKED_CONTENT_KEY}_${user.id}`, JSON.stringify(updatedLikedContent));
      } catch (error: any) {
        console.error("Error unliking content:", error);
        toast({
          title: "Error",
          description: `Could not unlike content: ${error.message}`,
          variant: "destructive",
        });
      }
    },
    isContentLiked: (contentId: string) => likedContent.some(id => id.includes(contentId)),
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
