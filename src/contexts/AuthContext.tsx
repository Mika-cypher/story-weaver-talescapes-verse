
import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useSocialOperations } from "@/hooks/useSocialOperations";
import { useSubmissionOperations } from "@/hooks/useSubmissionOperations";
import { socialService } from "@/services/socialService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const { login, signup, logout, updateProfile } = useAuthOperations();
  const { saveStory, unsaveStory, followUser, unfollowUser, likeContent, unlikeContent } = useSocialOperations();
  const { getUserSubmissions, submitContent } = useSubmissionOperations();

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
    updateProfile: (updates) => updateProfile(user, updates),
    savedStories,
    saveStory: (storyId) => saveStory(user, storyId, savedStories, setSavedStories),
    unsaveStory: (storyId) => unsaveStory(user, storyId, savedStories, setSavedStories),
    isStorySaved: (storyId: string) => socialService.isStorySaved(storyId, savedStories),
    followUser: (userId) => followUser(user, userId, following, setFollowing),
    unfollowUser: (userId) => unfollowUser(user, userId, following, setFollowing),
    isFollowingUser: (userId: string) => socialService.isFollowingUser(userId, following),
    likeContent: (contentId, contentType) => likeContent(user, contentId, contentType, likedContent, setLikedContent),
    unlikeContent: (contentId, contentType) => unlikeContent(user, contentId, contentType, likedContent, setLikedContent),
    isContentLiked: (contentId: string) => socialService.isContentLiked(contentId, likedContent),
    getUserSubmissions: () => getUserSubmissions(user),
    submitContent: (content) => submitContent(user, content)
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
