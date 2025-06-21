
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { storyService } from "@/services/storyService";
import { mediaService } from "@/services/mediaService";
import { useToast } from "@/hooks/use-toast";

export const useProfileData = () => {
  const { user, logout, savedStories, isLoggedIn } = useAuth();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);
  const [showDrafts, setShowDrafts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  const [userPublishedStories, setUserPublishedStories] = useState<any[]>([]);
  const [userSavedStories, setUserSavedStories] = useState<any[]>([]);
  const [userMedia, setUserMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Determine if viewing own profile or someone else's
  const isOwnProfile = !username || (user && user.username === username);
  const displayName = isOwnProfile ? (user ? user.username : "") : username;
  
  useEffect(() => {
    if (!isLoggedIn && isOwnProfile) {
      navigate("/login");
      return;
    }
    
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Load stories
        const allStories = await storyService.getStories();
        
        // Handle saved stories
        const savedStoriesData = allStories
          .filter(story => savedStories.includes(story.id))
          .map(story => ({
            id: story.id,
            title: story.title,
            excerpt: story.description,
            coverImage: story.coverImage || "/placeholder.svg",
            category: "Interactive Story",
            hasAudio: !!story.scenes.some(scene => scene.audio),
            audioSrc: story.scenes.find(scene => scene.audio)?.audio,
            likes: 12,
            views: 45,
            date: new Date(story.createdAt).toLocaleDateString()
          }));
        setUserSavedStories(savedStoriesData);
        
        // Handle published stories
        const publishedStoriesData = allStories
          .filter(story => 
            (isOwnProfile ? true : story.status === "published") && 
            story.author === displayName
          )
          .map(story => ({
            id: story.id,
            title: story.title,
            excerpt: story.description,
            coverImage: story.coverImage || "/placeholder.svg",
            category: "Interactive Story",
            hasAudio: !!story.scenes.some(scene => scene.audio),
            audioSrc: story.scenes.find(scene => scene.audio)?.audio,
            likes: 18,
            views: 67,
            date: new Date(story.createdAt).toLocaleDateString(),
            status: story.status
          }));
        setUserPublishedStories(publishedStoriesData);

        // Load user media if viewing own profile or if user exists
        if (user && isOwnProfile) {
          const mediaData = await mediaService.getUserMedia(user.id);
          setUserMedia(mediaData);
        }
        
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [isLoggedIn, isOwnProfile, navigate, savedStories, displayName, user, toast]);

  const handleToggleAudio = (storyId: string) => {
    setActiveAudioId(activeAudioId === storyId ? null : storyId);
  };

  const handleToggleSettings = (storyId: string) => {
    setOpenSettingsId(openSettingsId === storyId ? null : storyId);
  };
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: !isFollowing ? "Following user" : "Unfollowed user",
      description: !isFollowing ? `You are now following ${displayName}` : `You are no longer following ${displayName}`,
    });
  };
  
  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to clipboard",
    });
  };

  const handleMediaUploadComplete = (media: any) => {
    setUserMedia(prev => [media, ...prev]);
    setShowUpload(false);
    toast({
      title: "Media uploaded!",
      description: "Your media has been added to your profile"
    });
  };

  return {
    user,
    logout,
    isOwnProfile,
    displayName,
    loading,
    activeAudioId,
    openSettingsId,
    showDrafts,
    setShowDrafts,
    isFollowing,
    showUpload,
    setShowUpload,
    userPublishedStories,
    userSavedStories,
    userMedia,
    handleToggleAudio,
    handleToggleSettings,
    handleFollow,
    handleShareProfile,
    handleMediaUploadComplete
  };
};
