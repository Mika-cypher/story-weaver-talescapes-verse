
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function StoryManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("drafts");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      const allStories = await storyService.getStories();
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

  const drafts = stories.filter(story => story.status === "draft");
  const published = stories.filter(story => story.status === "published");

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading your stories...</p>
      </div>
    );
  }

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
              {drafts.map(story => (
                <Card key={story.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {story.description || "No description provided."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {new Date(story.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/create?edit=${story.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteStory(story.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
              {published.map(story => (
                <Card key={story.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {story.description || "No description provided."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Published: {new Date(story.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/story/${story.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteStory(story.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-md">
              <h3 className="font-medium text-lg mb-2">No published stories</h3>
              <p className="text-muted-foreground mb-4">
                Publish your stories to make them available for readers
              </p>
              {drafts.length > 0 ? (
                <p className="text-sm">
                  You have {drafts.length} draft{drafts.length !== 1 ? 's' : ''} ready to be published.
                </p>
              ) : (
                <Button onClick={() => navigate("/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Story
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
