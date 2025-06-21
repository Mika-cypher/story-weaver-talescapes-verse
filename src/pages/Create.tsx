
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
import { StoryBuilder } from "@/components/story/StoryBuilder";
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
  const [isSaving, setIsSaving] = useState(false);
  
  // Story structure
  const [activeTab, setActiveTab] = useState("write");
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create stories",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isLoggedIn, navigate, toast]);
  
  // Initialize with first scene
  useEffect(() => {
    if (scenes.length === 0) {
      const firstSceneId = uuidv4();
      const initialScene: StoryScene = {
        id: firstSceneId,
        title: "Start",
        content: "",
        choices: [],
      };
      setScenes([initialScene]);
      setCurrentSceneId(firstSceneId);
    }
  }, []);

  // Check if story can be published
  const canPublish = title && scenes.length > 0 && scenes[0].content.trim().length > 0;

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
      const startSceneId = scenes.length > 0 ? scenes[0].id : "";
      
      const newStory: Story = {
        id: storyId,
        title,
        description: excerpt,
        author: user?.username || user?.email || "Anonymous",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
        featured: false,
        startSceneId,
        scenes,
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
    if (!title || scenes.length === 0 || !scenes[0].content) {
      toast({
        title: "Incomplete Story",
        description: "Please provide a title and content for your story.",
        variant: "destructive",
      });
      return;
    }

    setActiveTab("preview");
  };

  // Publish story
  const handlePublish = async () => {
    if (!canPublish) {
      toast({
        title: "Cannot Publish",
        description: "Your story needs a title and at least one scene with content.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const storyId = uuidv4();
      const startSceneId = scenes.length > 0 ? scenes[0].id : "";
      
      const newStory: Story = {
        id: storyId,
        title,
        description: excerpt,
        author: user?.username || user?.email || "Anonymous",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        featured: false,
        startSceneId,
        scenes,
      };
      
      storyService.saveStory(newStory);
      
      toast({
        title: "Story Published",
        description: "Your story has been published and is now available to readers.",
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoryBuilderHeader
            title={title}
            onSaveDraft={handleSaveDraft}
            onPreview={handlePreview}
            onPublish={handlePublish}
            canPublish={canPublish}
            isSaving={isSaving}
          />

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <StoryForm 
                title={title}
                setTitle={setTitle}
                excerpt={excerpt}
                setExcerpt={setExcerpt}
                category={category}
                setCategory={setCategory}
                onSaveDraft={handleSaveDraft}
                onPreview={handlePreview}
                onPublish={handlePublish}
              />

              <div className="mt-8">
                <StoryBuilder 
                  scenes={scenes}
                  setScenes={setScenes}
                  currentSceneId={currentSceneId}
                  setCurrentSceneId={setCurrentSceneId}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
