import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Story, StoryScene } from "@/types/story";
import { storyService } from "@/services/storyService";
import { useAuth } from "@/contexts/AuthContext";

export const useStoryCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Basic story details
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Check if story can be published
  const canPublish = title && content.trim().length > 0;

  // Create story object helper
  const createStoryObject = (status: "draft" | "published") => {
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
      author: user?.id || "anonymous", // Use user ID consistently for author matching
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
      featured: false,
      startSceneId: sceneId,
      scenes: [scene],
    };

    return newStory;
  };

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
      const newStory = createStoryObject("draft");
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
      const newStory = createStoryObject("published");
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

  return {
    // State
    title,
    setTitle,
    excerpt,
    setExcerpt,
    category,
    setCategory,
    content,
    setContent,
    isSaving,
    canPublish,
    // Actions
    handleSaveDraft,
    handlePreview,
    handlePublish,
  };
};
