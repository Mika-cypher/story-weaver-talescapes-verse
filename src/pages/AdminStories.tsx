
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Eye, Star, StarOff, FileCheck, FileMinus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
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
        title: "Error loading stories",
        description: "There was a problem fetching your stories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        await storyService.deleteStory(id);
        toast({
          title: "Story deleted",
          description: "The story has been successfully deleted",
        });
        loadStories();
      } catch (error) {
        console.error("Error deleting story:", error);
        toast({
          title: "Error",
          description: "Failed to delete the story",
          variant: "destructive"
        });
      }
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await storyService.updateStoryFeatured(id, featured);
      toast({
        title: featured ? "Story featured" : "Story unfeatured",
        description: `The story has been ${featured ? "featured" : "unfeatured"}`,
      });
      loadStories();
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast({
        title: "Error",
        description: "Failed to update story featured status",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (id: string, status: "draft" | "published") => {
    try {
      await storyService.updateStoryStatus(id, status);
      toast({
        title: `Story ${status === "published" ? "published" : "unpublished"}`,
        description: `The story is now ${status === "published" ? "visible to the public" : "in draft mode"}`,
      });
      loadStories();
    } catch (error) {
      console.error("Error updating story status:", error);
      toast({
        title: "Error",
        description: "Failed to update story status",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stories</h1>
          <p className="text-muted-foreground">Manage your interactive stories</p>
        </div>
        <Button onClick={() => navigate("/admin/stories/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Story
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading stories...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="bg-card rounded-t-md border-b">
            <div className="grid grid-cols-12 p-4 font-medium text-muted-foreground">
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Featured</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
          </div>
          
          {stories.length > 0 ? (
            <div className="divide-y">
              {stories.map(story => (
                <div key={story.id} className="grid grid-cols-12 p-4 items-center hover:bg-muted/50">
                  <div className="col-span-5 font-medium">{story.title}</div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      story.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {story.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    {story.featured ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs">Not featured</span>
                    )}
                  </div>
                  <div className="col-span-3 flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/stories/${story.id}/preview`)}
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatured(story.id, !story.featured)}
                      title={story.featured ? "Unfeature" : "Feature"}
                    >
                      {story.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(story.id, story.status === "published" ? "draft" : "published")}
                      title={story.status === "published" ? "Unpublish" : "Publish"}
                    >
                      {story.status === "published" ? <FileMinus className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/stories/${story.id}/edit`)}
                      title="Edit"
                      className="text-primary"
                    >
                      <span className="sr-only">Edit</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(story.id)}
                      title="Delete"
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No stories yet. Get started by creating your first story!</p>
              <Button onClick={() => navigate("/admin/stories/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Story
              </Button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminStories;
