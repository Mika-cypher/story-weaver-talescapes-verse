
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useUserPreferences = (userId: string | undefined) => {
  const [savedStories, setSavedStories] = useState<string[]>([]);
  const [likedContent, setLikedContent] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const { toast } = useToast();

  const loadUserPreferences = (userId: string) => {
    try {
      // Load saved stories
      const savedStoriesData = localStorage.getItem(`talescapes_saved_stories_${userId}`);
      if (savedStoriesData) {
        setSavedStories(JSON.parse(savedStoriesData));
      }
      
      // Load liked content
      const likedContentData = localStorage.getItem(`talescapes_liked_content_${userId}`);
      if (likedContentData) {
        setLikedContent(JSON.parse(likedContentData));
      }
      
      // Load following data
      const followingData = localStorage.getItem(`talescapes_following_${userId}`);
      if (followingData) {
        setFollowing(JSON.parse(followingData));
      }
    } catch (error: any) {
      console.error('Error loading user preferences:', error);
      toast({
        title: "Warning",
        description: "Some of your preferences couldn't be loaded",
        variant: "destructive",
      });
    }
  };

  return {
    savedStories,
    setSavedStories,
    likedContent,
    setLikedContent,
    following,
    setFollowing,
    loadUserPreferences,
  };
};
