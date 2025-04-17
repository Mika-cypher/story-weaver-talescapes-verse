
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { storyService } from "@/services/storyService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SubmissionForm } from "@/components/user/SubmissionForm";
import { AccountSettings } from "@/components/user/AccountSettings";

// Import newly created components
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StoriesTab } from "@/components/profile/StoriesTab";
import { SavedStoriesTab } from "@/components/profile/SavedStoriesTab";
import { MediaTab } from "@/components/profile/MediaTab";
import { ContributionsTab } from "@/components/profile/ContributionsTab";

const Profile: React.FC = () => {
  const { user, logout, savedStories, isLoggedIn } = useAuth();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<number | null>(null);
  const [showDrafts, setShowDrafts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Determine if viewing own profile or someone else's
  const isOwnProfile = !username || (user && user.username === username);
  const displayName = isOwnProfile ? (user ? user.username : "") : username;
  
  if (!isLoggedIn && isOwnProfile) {
    navigate("/login");
    return null;
  }
  
  // Get user's stories from the story service
  const allStories = storyService.getStories();
  
  // Get user saved stories
  const userSavedStories = allStories
    .filter(story => savedStories.includes(story.id))
    .map(story => ({
      id: parseInt(story.id),
      title: story.title,
      excerpt: story.description,
      coverImage: story.coverImage || "/placeholder.svg",
      category: "Interactive Story",
      hasAudio: !!story.scenes.some(scene => scene.audio),
      audioSrc: story.scenes.find(scene => scene.audio)?.audio,
      likes: 12, // Mock data
      views: 45, // Mock data
      date: new Date(story.createdAt).toLocaleDateString()
    }));
  
  // Get user's published stories
  const userPublishedStories = allStories
    .filter(story => 
      (isOwnProfile ? true : story.status === "published") && 
      story.author === displayName
    )
    .map(story => ({
      id: parseInt(story.id),
      title: story.title,
      excerpt: story.description,
      coverImage: story.coverImage || "/placeholder.svg",
      category: "Interactive Story",
      hasAudio: !!story.scenes.some(scene => scene.audio),
      audioSrc: story.scenes.find(scene => scene.audio)?.audio,
      likes: 18, // Mock data
      views: 67, // Mock data
      date: new Date(story.createdAt).toLocaleDateString(),
      status: story.status
    }));
  
  // Mock data for other content types
  const userImages = [
    { id: "img1", title: "Mountain Landscape", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", date: "2023-06-15", status: "published" },
    { id: "img2", title: "Forest Path", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05", date: "2023-07-20", status: "pending" },
    { id: "img3", title: "Ocean Sunset", url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7", date: "2023-08-05", status: "draft" }
  ];

  const userAudios = [
    { id: "aud1", title: "Forest Ambience", url: "/sounds/forest.mp3", duration: "2:45", date: "2023-05-10", status: "published" },
    { id: "aud2", title: "Ocean Waves", url: "/sounds/ocean.mp3", duration: "3:20", date: "2023-06-22", status: "pending" }
  ];

  const userSubmissions = [
    { id: "sub1", title: "Traditional Folk Song", type: "Audio", submittedDate: "2023-07-15", date: "2023-07-15", status: "approved" },
    { id: "sub2", title: "Cultural Artifact Photo", type: "Image", submittedDate: "2023-08-02", date: "2023-08-02", status: "pending" },
    { id: "sub3", title: "Local Legend", type: "Story", submittedDate: "2023-09-10", date: "2023-09-10", status: "rejected" }
  ];
  
  const handleToggleAudio = (storyId: number) => {
    setActiveAudioId(activeAudioId === storyId ? null : storyId);
  };

  const handleToggleSettings = (storyId: number) => {
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="stories">Stories</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              {isOwnProfile && <TabsTrigger value="submit">Submit Content</TabsTrigger>}
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
            
            <TabsContent value="media" className="mt-6">
              <MediaTab 
                isOwnProfile={isOwnProfile}
                displayName={displayName}
                userImages={userImages}
                userAudios={userAudios}
              />
            </TabsContent>
            
            <TabsContent value="contributions" className="mt-6">
              <ContributionsTab 
                isOwnProfile={isOwnProfile}
                displayName={displayName}
                userSubmissions={userSubmissions}
              />
            </TabsContent>
            
            {isOwnProfile && (
              <TabsContent value="submit" className="mt-6">
                <SubmissionForm />
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
