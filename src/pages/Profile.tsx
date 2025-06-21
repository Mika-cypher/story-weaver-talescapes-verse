import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { storyService } from "@/services/storyService";
import { mediaService } from "@/services/mediaService";
import { Story } from "@/types/story"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SubmissionForm } from "@/components/user/SubmissionForm";
import { AccountSettings } from "@/components/user/AccountSettings";
import { MediaUpload } from "@/components/media/MediaUpload";
import { MediaGallery } from "@/components/media/MediaGallery";

// Import existing components
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StoriesTab } from "@/components/profile/StoriesTab";
import { SavedStoriesTab } from "@/components/profile/SavedStoriesTab";
import { ContributionsTab } from "@/components/profile/ContributionsTab";

const Profile: React.FC = () => {
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
            id: story.id, // Keep as string
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
            id: story.id, // Keep as string
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
  }, [isLoggedIn, isOwnProfile, navigate, savedStories, displayName, user]);
  
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <ProfileHeader 
              displayName={displayName}
              isOwnProfile={isOwnProfile}
              isFollowing={isFollowing}
              handleFollow={handleFollow}
              handleShareProfile={handleShareProfile}
              publishedStoriesCount={userPublishedStories.length}
            />
          </div>

          <Tabs defaultValue="stories" className="mt-8">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="stories">Stories</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              {isOwnProfile && <TabsTrigger value="submit">Submit</TabsTrigger>}
              {isOwnProfile && <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-2" />Upload</TabsTrigger>}
              {isOwnProfile && <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" />Settings</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="stories" className="mt-6">
              <StoriesTab 
                isOwnProfile={isOwnProfile}
                showDrafts={showDrafts}
                setShowDrafts={setShowDrafts}
                userPublishedStories={userPublishedStories}
                displayName={displayName}
                activeAudioId={activeAudioId}
                openSettingsId={openSettingsId}
                handleToggleAudio={handleToggleAudio}
                handleToggleSettings={handleToggleSettings}
              />
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {isOwnProfile ? "Your Media" : `${displayName}'s Media`}
                  </h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowUpload(!showUpload)}
                      className="text-sm text-primary hover:underline"
                    >
                      {showUpload ? "Hide Upload" : "Upload Media"}
                    </button>
                  )}
                </div>
                
                {showUpload && isOwnProfile && (
                  <MediaUpload onUploadComplete={handleMediaUploadComplete} />
                )}
                
                <MediaGallery 
                  userId={user?.id} 
                  showUploadedOnly={isOwnProfile}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              <SavedStoriesTab 
                isOwnProfile={isOwnProfile}
                userSavedStories={userSavedStories}
                activeAudioId={activeAudioId}
                openSettingsId={openSettingsId}
                handleToggleAudio={handleToggleAudio}
                handleToggleSettings={handleToggleSettings}
              />
            </TabsContent>
            
            <TabsContent value="contributions" className="mt-6">
              <ContributionsTab 
                isOwnProfile={isOwnProfile}
                displayName={displayName}
                userSubmissions={[]} // Will be populated from new service
              />
            </TabsContent>
            
            {isOwnProfile && (
              <TabsContent value="submit" className="mt-6">
                <SubmissionForm />
              </TabsContent>
            )}

            {isOwnProfile && (
              <TabsContent value="upload" className="mt-6">
                <MediaUpload onUploadComplete={handleMediaUploadComplete} />
              </TabsContent>
            )}
            
            {isOwnProfile && (
              <TabsContent value="settings" className="mt-6">
                <AccountSettings />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
