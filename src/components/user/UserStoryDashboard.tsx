
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Plus, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function UserStoryDashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("drafts");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      const allStories = await storyService.getStories();
      // Filter stories by current user (for now we'll use localStorage stories)
      // In a real app, this would filter by user ID
      setStories(allStories);
    } catch (error) {
      console.error("Error loading stories:", error);
      toast({
        title: "Error",
        description: "Failed to load your stories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        await storyService.deleteStory(id);
        toast({
          title: "Story deleted",
          description: "Your story has been successfully deleted."
        });
        loadStories();
      } catch (error) {
        console.error("Error deleting story:", error);
        toast({
          title: "Error",
          description: "Failed to delete your story",
          variant: "destructive"
        });
      }
    }
  };

  const handlePublishStory = async (story: Story) => {
    try {
      const updatedStory = { ...story, status: "published" as const };
      await storyService.saveStory(updatedStory);
      toast({
        title: "Story Published",
        description: "Your story is now available to readers."
      });
      loadStories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish your story",
        variant: "destructive"
      });
    }
  };

  const drafts = stories.filter(story => story.status === "draft");
  const published = stories.filter(story => story.status === "published");

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading your stories...</p>
      </div>
    );
  }

  const StoryCard = ({ story }: { story: Story }) => (
    <Card key={story.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 text-lg">{story.title}</CardTitle>
          <Badge variant={story.status === "published" ? "default" : "secondary"}>
            {story.status === "published" ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Draft
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {story.description || "No description provided."}
        </p>
        <div className="mt-3 text-xs text-muted-foreground">
          <p>Created: {new Date(story.createdAt).toLocaleDateString()}</p>
          <p>Scenes: {story.scenes?.length || 0}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/create?edit=${story.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/story/${story.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
        <div className="flex gap-2">
          {story.status === "draft" && (
            <Button 
              size="sm"
              onClick={() => handlePublishStory(story)}
            >
              Publish
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleDeleteStory(story.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Stories</h2>
        <Button onClick={() => navigate("/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Story
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({published.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="drafts" className="mt-6">
          {drafts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {drafts.map(story => <StoryCard key={story.id} story={story} />)}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-md">
              <h3 className="font-medium text-lg mb-2">No draft stories</h3>
              <p className="text-muted-foreground mb-4">
                Start creating your interactive story now
              </p>
              <Button onClick={() => navigate("/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Story
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="published" className="mt-6">
          {published.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {published.map(story => <StoryCard key={story.id} story={story} />)}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-md">
              <h3 className="font-medium text-lg mb-2">No published stories</h3>
              <p className="text-muted-foreground mb-4">
                Publish your first story to share it with readers
              </p>
              <Button onClick={() => navigate("/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Story
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
