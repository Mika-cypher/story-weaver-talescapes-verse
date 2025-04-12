
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storyService } from "@/services/storyService";
import { User, LogOut, BookmarkPlus } from "lucide-react";
import StoryList from "@/components/stories/StoryList";

const Profile: React.FC = () => {
  const { user, logout, savedStories } = useAuth();
  const navigate = useNavigate();
  const [activeAudioId, setActiveAudioId] = React.useState<number | null>(null);
  const [openSettingsId, setOpenSettingsId] = React.useState<number | null>(null);
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  // Get saved stories from the story service
  const allStories = storyService.getPublishedStories();
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
      likes: Math.floor(Math.random() * 100) // Mock data
    }));

  const handleToggleAudio = (storyId: number) => {
    setActiveAudioId(activeAudioId === storyId ? null : storyId);
  };

  const handleToggleSettings = (storyId: number) => {
    setOpenSettingsId(openSettingsId === storyId ? null : storyId);
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
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{user.username}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="saved" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="saved">Saved Stories</TabsTrigger>
              <TabsTrigger value="created">My Creations</TabsTrigger>
              <TabsTrigger value="feedback">My Feedback</TabsTrigger>
            </TabsList>
            <TabsContent value="saved" className="mt-6">
              {userSavedStories.length > 0 ? (
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
              )}
            </TabsContent>
            <TabsContent value="created" className="mt-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <CardTitle className="text-xl mb-2">Your creations will appear here</CardTitle>
                  <CardDescription>
                    Start creating your own interactive stories
                  </CardDescription>
                  <Button className="mt-4" onClick={() => navigate("/create")}>
                    Create New Story
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="feedback" className="mt-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <CardTitle className="text-xl mb-2">Your feedback history</CardTitle>
                  <CardDescription>
                    Comments and ratings you've left on stories will appear here
                  </CardDescription>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
