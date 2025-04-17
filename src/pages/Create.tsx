
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

const Create = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Basic story details
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  
  // Story structure
  const [activeTab, setActiveTab] = useState("write");
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  
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

  // Save story as draft
  const handleSaveDraft = () => {
    if (!title) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for your story.",
        variant: "destructive",
      });
      return;
    }

    const storyId = uuidv4();
    const startSceneId = scenes.length > 0 ? scenes[0].id : "";
    
    const newStory: Story = {
      id: storyId,
      title,
      description: excerpt,
      author: "Anonymous", // This would come from user context in a real app
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
    
    // Optionally navigate to edit page
    // navigate(`/admin/stories/${storyId}/edit`);
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
  const handlePublish = () => {
    if (!title) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for your story.",
        variant: "destructive",
      });
      return;
    }

    if (scenes.length === 0 || !scenes[0].content) {
      toast({
        title: "Missing Content",
        description: "Your story needs at least one scene with content.",
        variant: "destructive",
      });
      return;
    }

    const storyId = uuidv4();
    const startSceneId = scenes.length > 0 ? scenes[0].id : "";
    
    const newStory: Story = {
      id: storyId,
      title,
      description: excerpt,
      author: "Anonymous", // This would come from user context in a real app
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Create Your Story</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bring your imagination to life with interactive narratives, visuals, and audio.
            </p>
          </div>

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
