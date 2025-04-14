
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storyService } from "@/services/storyService";
import { User, LogOut, BookmarkPlus, PenSquare, FileImage, FileAudio, History, Send, Heart, BookOpen, Eye, MessageSquare, Share2, UserPlus, Copy } from "lucide-react";
import StoryList from "@/components/stories/StoryList";
import { UserContent } from "@/components/user/UserContent";
import { SubmissionForm } from "@/components/user/SubmissionForm";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

  // Fix the userSubmissions array by adding the required 'date' property
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
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt={displayName} />
                      <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{displayName}</CardTitle>
                        <Badge className="ml-2">Storyteller</Badge>
                      </div>
                      {!isOwnProfile && user && (
                        <Button 
                          variant={isFollowing ? "outline" : "default"} 
                          size="sm"
                          onClick={handleFollow}
                          className="mt-2"
                        >
                          {isFollowing ? (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                      )}
                      {isOwnProfile && user && (
                        <CardDescription>{user.email}</CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleShareProfile} title="Share Profile">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {isOwnProfile && (
                      <Button variant="outline" onClick={logout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{userPublishedStories.length}</p>
                    <p className="text-sm text-muted-foreground">Stories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">142</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">38</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="stories" className="mt-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="stories">Stories</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              {isOwnProfile && <TabsTrigger value="submit">Submit Content</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="stories" className="mt-6">
              {isOwnProfile && (
                <div className="flex items-center space-x-2 mb-4">
                  <Switch 
                    id="show-drafts" 
                    checked={showDrafts} 
                    onCheckedChange={setShowDrafts} 
                  />
                  <Label htmlFor="show-drafts">Show drafts</Label>
                </div>
              )}
              
              {userPublishedStories.length > 0 ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      {isOwnProfile ? "Your Stories" : `${displayName}'s Stories`}
                    </h3>
                    <StoryList 
                      stories={userPublishedStories.filter(story => 
                        showDrafts ? true : story.status === "published"
                      )}
                      activeAudioId={activeAudioId}
                      openSettingsId={openSettingsId}
                      onToggleAudio={handleToggleAudio}
                      onToggleSettings={handleToggleSettings}
                    />
                  </div>
                  
                  {isOwnProfile && (
                    <Button 
                      className="mt-2" 
                      onClick={() => navigate("/create")}
                    >
                      <PenSquare className="h-4 w-4 mr-2" />
                      Create New Story
                    </Button>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="text-xl mb-2">
                      {isOwnProfile ? "No stories yet" : `${displayName} hasn't published any stories yet`}
                    </CardTitle>
                    <CardDescription>
                      {isOwnProfile 
                        ? "Start creating your own interactive stories"
                        : "Check back later for new content"}
                    </CardDescription>
                    {isOwnProfile && (
                      <Button className="mt-4" onClick={() => navigate("/create")}>
                        Create New Story
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              {isOwnProfile ? (
                userSavedStories.length > 0 ? (
                  <StoryList 
                    stories={userSavedStories}
                    activeAudioId={activeAudioId}
                    openSettingsId={openSettingsId}
                    onToggleAudio={handleToggleAudio}
                    onToggleSettings={handleToggleSettings}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <CardTitle className="text-xl mb-2">No saved stories yet</CardTitle>
                      <CardDescription>
                        Explore stories and bookmark the ones you like to see them here
                      </CardDescription>
                      <Button className="mt-4" onClick={() => navigate("/explore")}>
                        Explore Stories
                      </Button>
                    </CardContent>
                  </Card>
                )
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CardTitle className="text-xl mb-2">Saved stories are private</CardTitle>
                    <CardDescription>
                      Users can only see their own saved stories
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="media" className="mt-6">
              <Tabs defaultValue="images">
                <TabsList>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                </TabsList>
                
                <TabsContent value="images" className="mt-4">
                  {(isOwnProfile || userImages.some(img => img.status === "published")) ? (
                    <UserContent 
                      items={userImages.filter(img => isOwnProfile ? true : img.status === "published")}
                      type="image"
                      isOwner={isOwnProfile}
                    />
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <CardTitle className="text-xl mb-2">
                          {`${displayName} hasn't uploaded any images yet`}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="audio" className="mt-4">
                  {(isOwnProfile || userAudios.some(audio => audio.status === "published")) ? (
                    <UserContent 
                      items={userAudios.filter(audio => isOwnProfile ? true : audio.status === "published")}
                      type="audio"
                      isOwner={isOwnProfile}
                    />
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <FileAudio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <CardTitle className="text-xl mb-2">
                          {`${displayName} hasn't uploaded any audio yet`}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="contributions" className="mt-6">
              {(isOwnProfile || userSubmissions.some(sub => sub.status === "approved")) ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {isOwnProfile ? "Your Contributions" : `${displayName}'s Contributions`}
                  </h3>
                  <UserContent 
                    items={userSubmissions.filter(sub => 
                      isOwnProfile ? true : sub.status === "approved"
                    )}
                    type="submission"
                    isOwner={isOwnProfile}
                  />
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="text-xl mb-2">
                      {isOwnProfile 
                        ? "You haven't made any contributions yet" 
                        : `${displayName} hasn't made any contributions yet`}
                    </CardTitle>
                    <CardDescription>
                      Cultural Heritage contributions help preserve stories, music, and art
                    </CardDescription>
                    {isOwnProfile && (
                      <Button className="mt-4" onClick={() => navigate("/profile?tab=submit")}>
                        Submit to Cultural Heritage Archive
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {isOwnProfile && (
              <TabsContent value="submit" className="mt-6">
                <SubmissionForm />
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
