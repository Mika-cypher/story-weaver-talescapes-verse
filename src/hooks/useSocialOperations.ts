
import { useToast } from "@/hooks/use-toast";
import { socialService, SocialError } from "@/services/socialService";
import { ExtendedUser } from "@/types/auth";

export const useSocialOperations = () => {
  const { toast } = useToast();

  const saveStory = async (
    user: ExtendedUser | null,
    storyId: string,
    savedStories: string[],
    setSavedStories: (stories: string[]) => void
  ) => {
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

  const unsaveStory = async (
    user: ExtendedUser | null,
    storyId: string,
    savedStories: string[],
    setSavedStories: (stories: string[]) => void
  ) => {
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

  const followUser = (
    user: ExtendedUser | null,
    userId: string,
    following: string[],
    setFollowing: (following: string[]) => void
  ) => {
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
  
  const unfollowUser = (
    user: ExtendedUser | null,
    userId: string,
    following: string[],
    setFollowing: (following: string[]) => void
  ) => {
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
  
  const likeContent = (
    user: ExtendedUser | null,
    contentId: string,
    contentType: string,
    likedContent: string[],
    setLikedContent: (liked: string[]) => void
  ) => {
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
  
  const unlikeContent = (
    user: ExtendedUser | null,
    contentId: string,
    contentType: string,
    likedContent: string[],
    setLikedContent: (liked: string[]) => void
  ) => {
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

  return {
    saveStory,
    unsaveStory,
    followUser,
    unfollowUser,
    likeContent,
    unlikeContent
  };
};
