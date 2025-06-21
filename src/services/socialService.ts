
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

// Local storage keys for fallback
export const FOLLOWING_KEY = "talescapes_following";
export const LIKED_CONTENT_KEY = "talescapes_liked_content";
export const SAVED_STORIES_KEY = "talescapes_saved_stories";

export class SocialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SocialError';
  }
}

export const socialService = {
  /**
   * Save a story to user's saved stories (Supabase + localStorage fallback)
   */
  saveStory: async (userId: string, storyId: string, savedStories: string[]): Promise<string[]> => {
    try {
      if (!userId || !storyId) {
        throw new SocialError("Invalid user or story ID");
      }
      
      // Try Supabase first
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        const { error } = await supabase
          .from('saved_stories')
          .insert({
            user_id: userId,
            story_id: storyId
          });
        
        if (!error) {
          return [...savedStories, storyId];
        }
        
        console.error("Supabase save story error:", error);
        // Fall through to localStorage
      }
      
      // Fallback to localStorage
      if (!savedStories.includes(storyId)) {
        const updatedSavedStories = [...savedStories, storyId];
        localStorage.setItem(`${SAVED_STORIES_KEY}_${userId}`, JSON.stringify(updatedSavedStories));
        return updatedSavedStories;
      }
      
      return savedStories;
    } catch (error) {
      console.error("Error saving story:", error);
      throw new SocialError(error instanceof Error ? error.message : "Failed to save story");
    }
  },

  /**
   * Remove a story from user's saved stories (Supabase + localStorage fallback)
   */
  unsaveStory: async (userId: string, storyId: string, savedStories: string[]): Promise<string[]> => {
    try {
      if (!userId || !storyId) {
        throw new SocialError("Invalid user or story ID");
      }
      
      // Try Supabase first
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        const { error } = await supabase
          .from('saved_stories')
          .delete()
          .eq('user_id', userId)
          .eq('story_id', storyId);
        
        if (!error) {
          return savedStories.filter(id => id !== storyId);
        }
        
        console.error("Supabase unsave story error:", error);
        // Fall through to localStorage
      }
      
      // Fallback to localStorage
      const updatedSavedStories = savedStories.filter(id => id !== storyId);
      localStorage.setItem(`${SAVED_STORIES_KEY}_${userId}`, JSON.stringify(updatedSavedStories));
      return updatedSavedStories;
    } catch (error) {
      console.error("Error removing saved story:", error);
      throw new SocialError(error instanceof Error ? error.message : "Failed to remove story");
    }
  },

  /**
   * Follow a user
   */
  followUser: (userId: string, targetUserId: string, following: string[]): string[] => {
    try {
      if (!userId || !targetUserId) {
        throw new SocialError("Invalid user ID");
      }
      
      if (userId === targetUserId) {
        throw new SocialError("You cannot follow yourself");
      }
      
      if (!following.includes(targetUserId)) {
        const updatedFollowing = [...following, targetUserId];
        localStorage.setItem(`${FOLLOWING_KEY}_${userId}`, JSON.stringify(updatedFollowing));
        return updatedFollowing;
      }
      
      return following;
    } catch (error) {
      console.error("Error following user:", error);
      throw new SocialError(error instanceof Error ? error.message : "Failed to follow user");
    }
  },

  unfollowUser: (userId: string, targetUserId: string, following: string[]): string[] => {
    try {
      if (!userId || !targetUserId) {
        throw new SocialError("Invalid user ID");
      }
      
      const updatedFollowing = following.filter(id => id !== targetUserId);
      localStorage.setItem(`${FOLLOWING_KEY}_${userId}`, JSON.stringify(updatedFollowing));
      return updatedFollowing;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw new SocialError(error instanceof Error ? error.message : "Failed to unfollow user");
    }
  },

  likeContent: (userId: string, contentId: string, contentType: string, likedContent: string[]): string[] => {
    try {
      if (!userId || !contentId || !contentType) {
        throw new SocialError("Invalid content information");
      }
      
      const likeId = `${contentType}_${contentId}`;
      if (!likedContent.includes(likeId)) {
        const updatedLikedContent = [...likedContent, likeId];
        localStorage.setItem(`${LIKED_CONTENT_KEY}_${userId}`, JSON.stringify(updatedLikedContent));
        return updatedLikedContent;
      }
      
      return likedContent;
    } catch (error) {
      console.error("Error liking content:", error);
      throw new SocialError(error instanceof Error ? error.message : "Failed to like content");
    }
  },

  unlikeContent: (userId: string, contentId: string, contentType: string, likedContent: string[]): string[] => {
    try {
      if (!userId || !contentId || !contentType) {
        throw new SocialError("Invalid content information");
      }
      
      const likeId = `${contentType}_${contentId}`;
      const updatedLikedContent = likedContent.filter(id => id !== likeId);
      localStorage.setItem(`${LIKED_CONTENT_KEY}_${userId}`, JSON.stringify(updatedLikedContent));
      return updatedLikedContent;
    } catch (error) {
      console.error("Error unliking content:", error);
      throw new SocialError(error instanceof Error ? error.message : "Failed to unlike content");
    }
  },

  /**
   * Check if content is liked
   */
  isContentLiked: (contentId: string, likedContent: string[]): boolean => {
    return likedContent.some(id => id.includes(contentId));
  },

  isFollowingUser: (targetUserId: string, following: string[]): boolean => {
    return following.includes(targetUserId);
  },

  isStorySaved: (storyId: string, savedStories: string[]): boolean => {
    return savedStories.includes(storyId);
  }
};
