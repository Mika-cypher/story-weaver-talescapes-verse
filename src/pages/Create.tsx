
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Story, StoryScene } from "@/types/story";
import { storyService } from "@/services/storyService";
import { StoryForm } from "@/components/story/StoryForm";
import { StoryBuilderHeader } from "@/components/story/StoryBuilderHeader";
import { useAuth } from "@/contexts/AuthContext";

const Create = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  
  // Basic story details
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to write stories",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isLoggedIn, navigate, toast]);

  // Check if story can be published
  const canPublish = title && content.trim().length > 0;

  // Save story as draft
  const handleSaveDraft = async () => {
    if (!title) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for your story.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const storyId = uuidv4();
      const sceneId = uuidv4();
      
      // Create a single scene for the linear story
      const scene: StoryScene = {
        id: sceneId,
        title: "Story Content",
        content: content,
        choices: [],
        isEnding: true
      };
      
      const newStory: Story = {
        id: storyId,
        title,
        description: excerpt,
        author: user?.username || user?.email || "Anonymous",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
        featured: false,
        startSceneId: sceneId,
        scenes: [scene],
      };
      
      storyService.saveStory(newStory);
      
      toast({
        title: "Draft Saved",
        description: "Your story has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save your story draft.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Preview story
  const handlePreview = () => {
    if (!title || !content.trim()) {
      toast({
        title: "Incomplete Story",
        description: "Please provide a title and content for your story.",
        variant: "destructive",
      });
      return;
    }

    // For now, just show a preview message
    toast({
      title: "Preview",
      description: "Story preview will open in a new window (feature coming soon).",
    });
  };

  // Publish story
  const handlePublish = async () => {
    if (!canPublish) {
      toast({
        title: "Cannot Publish",
        description: "Your story needs a title and content to be published.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const storyId = uuidv4();
      const sceneId = uuidv4();
      
      // Create a single scene for the linear story
      const scene: StoryScene = {
        id: sceneId,
        title: "Story Content",
        content: content,
        choices: [],
        isEnding: true
      };
      
      const newStory: Story = {
        id: storyId,
        title,
        description: excerpt,
        author: user?.username || user?.email || "Anonymous",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        featured: false,
        startSceneId: sceneId,
        scenes: [scene],
      };
      
      storyService.saveStory(newStory);
      
      toast({
        title: "Story Published!",
        description: "Your story is now live and available to readers.",
      });
      
      navigate("/explore");
    } catch (error) {
      toast({
        title: "Publish Failed",
        description: "Could not publish your story.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Write Your Story</h1>
            <p className="text-muted-foreground">
              Share your creativity with readers around the world. Every great story starts with a single word.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <StoryForm 
                title={title}
                setTitle={setTitle}
                excerpt={excerpt}
                setExcerpt={setExcerpt}
                category={category}
                setCategory={setCategory}
                content={content}
                setContent={setContent}
                onSaveDraft={handleSaveDraft}
                onPreview={handlePreview}
                onPublish={handlePublish}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
