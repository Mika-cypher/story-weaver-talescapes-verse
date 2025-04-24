import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { storyService } from "@/services/storyService";
import { Story, StoryScene, StoryChoice } from "@/types/story";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Plus,
  Save,
  Trash,
  Eye,
  Play,
  Image as ImageIcon,
  Music,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useForm } from "react-hook-form";
import { SceneSidebar } from "./SceneSidebar";
import { StoryDetailsForm } from "./StoryDetailsForm";
import { SceneEditorPanel } from "./SceneEditorPanel";

interface StoryFormData {
  title: string;
  description: string;
  coverImage: string;
  author: string;
}

export const StoryEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewStory = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [story, setStory] = useState<Story>({
    id: isNewStory ? uuidv4() : id || "",
    title: "",
    description: "",
    coverImage: "",
    author: "Admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
    featured: false,
    startSceneId: "",
    scenes: []
  });
  
  const [currentSceneId, setCurrentSceneId] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<StoryFormData>({
    defaultValues: {
      title: story.title,
      description: story.description,
      coverImage: story.coverImage || "",
      author: story.author
    }
  });

  useEffect(() => {
    const loadStory = async () => {
      if (!isNewStory && id) {
        setLoading(true);
        try {
          const existingStory = await storyService.getStoryById(id);
          if (existingStory) {
            setStory(existingStory);
            form.reset({
              title: existingStory.title,
              description: existingStory.description,
              coverImage: existingStory.coverImage || "",
              author: existingStory.author
            });
            
            if (existingStory.startSceneId && existingStory.scenes.length > 0) {
              setCurrentSceneId(existingStory.startSceneId);
            }
          } else {
            setError("Story not found");
            toast({
              title: "Story not found",
              description: "The story you're trying to edit doesn't exist",
              variant: "destructive"
            });
            navigate("/admin/stories");
          }
        } catch (err) {
          console.error("Error loading story:", err);
          setError("Failed to load the story");
          toast({
            title: "Error",
            description: "Failed to load the story",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      } else if (isNewStory) {
        const firstSceneId = uuidv4();
        const newScene: StoryScene = {
          id: firstSceneId,
          title: "First Scene",
          content: "Start your story here...",
          choices: [],
          isEnding: false
        };
        
        setStory(prev => ({
          ...prev,
          startSceneId: firstSceneId,
          scenes: [newScene]
        }));
        
        setCurrentSceneId(firstSceneId);
      }
    };

    loadStory();
  }, [id, isNewStory, navigate, toast, form]);

  const currentScene = story.scenes.find(scene => scene.id === currentSceneId);

  const saveStory = async (formData: StoryFormData) => {
    setSaving(true);
    try {
      const updatedStory: Story = {
        ...story,
        title: formData.title,
        description: formData.description,
        coverImage: formData.coverImage,
        author: formData.author,
        updatedAt: new Date().toISOString()
      };
      
      await storyService.saveStory(updatedStory);
      
      toast({
        title: "Story saved",
        description: "Your story has been saved successfully",
      });
      
      if (isNewStory) {
        navigate(`/admin/stories/${updatedStory.id}/edit`);
      }
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        title: "Error saving story",
        description: "There was an error saving your story",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading story...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => navigate("/admin/stories")}>
            Back to Stories
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewStory ? "Create New Story" : "Edit Story"}
          </h1>
          <p className="text-muted-foreground">
            {isNewStory 
              ? "Create a new interactive story with branching choices" 
              : "Edit your interactive story and save your changes"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewStory}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={form.handleSubmit(saveStory)} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Story
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <SceneSidebar
            scenes={story.scenes}
            startSceneId={story.startSceneId}
            currentSceneId={currentSceneId}
            setCurrentSceneId={setCurrentSceneId}
            deleteScene={deleteScene}
            addScene={addScene}
          />
        </div>
        <div className="lg:col-span-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(saveStory)}>
              <Tabs defaultValue="story-details">
                <TabsList>
                  <TabsTrigger value="story-details">Story Details</TabsTrigger>
                  {currentScene && (
                    <TabsTrigger value="scene-editor">Scene Editor</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="story-details" className="space-y-4 mt-4">
                  <StoryDetailsForm form={form} />
                </TabsContent>
                {currentScene && (
                  <TabsContent value="scene-editor" className="space-y-4 mt-4">
                    <SceneEditorPanel
                      currentScene={currentScene}
                      scenes={story.scenes}
                      currentSceneId={currentSceneId}
                      startSceneId={story.startSceneId}
                      setAsStartScene={setAsStartScene}
                      toggleSceneEnding={toggleSceneEnding}
                      updateSceneTitle={updateSceneTitle}
                      updateSceneContent={updateSceneContent}
                      updateSceneImage={updateSceneImage}
                      updateSceneAudio={updateSceneAudio}
                      addChoice={addChoice}
                      updateChoice={updateChoice}
                      deleteChoice={deleteChoice}
                    />
                  </TabsContent>
                )}
              </Tabs>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );

  function addScene() {
    const newSceneId = uuidv4();
    const newScene: StoryScene = {
      id: newSceneId,
      title: `Scene ${story.scenes.length + 1}`,
      content: "",
      choices: [],
      isEnding: false
    };
    
    setStory(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene]
    }));
    
    setCurrentSceneId(newSceneId);
  }

  function deleteScene(sceneId: string) {
    if (story.scenes.length <= 1) {
      toast({
        title: "Cannot delete scene",
        description: "A story must have at least one scene",
        variant: "destructive"
      });
      return;
    }
    
    if (sceneId === story.startSceneId) {
      toast({
        title: "Cannot delete start scene",
        description: "You cannot delete the starting scene. Set another scene as the start scene first.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedScenes = story.scenes.map(scene => {
      if (scene.id !== sceneId) {
        const updatedChoices = scene.choices.filter(choice => choice.nextSceneId !== sceneId);
        return {
          ...scene,
          choices: updatedChoices
        };
      }
      return scene;
    }).filter(scene => scene.id !== sceneId);
    
    setStory(prev => ({
      ...prev,
      scenes: updatedScenes
    }));
    
    if (sceneId === currentSceneId) {
      setCurrentSceneId(updatedScenes[0]?.id || "");
    }
  }

  function updateSceneTitle(title: string) {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, title } : scene
      )
    }));
  }

  function updateSceneContent(content: string) {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, content } : scene
      )
    }));
  }

  function updateSceneImage(image: string) {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, image } : scene
      )
    }));
  }

  function updateSceneAudio(audio: string) {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, audio } : scene
      )
    }));
  }

  function toggleSceneEnding() {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, isEnding: !scene.isEnding } : scene
      )
    }));
  }

  function setAsStartScene() {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      startSceneId: currentSceneId
    }));
    
    toast({
      title: "Start scene set",
      description: "This scene is now the starting point of your story"
    });
  }

  function addChoice() {
    if (!currentSceneId) return;
    
    const newChoice: StoryChoice = {
      id: uuidv4(),
      text: "New choice",
      nextSceneId: ""
    };
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId 
          ? { ...scene, choices: [...scene.choices, newChoice] } 
          : scene
      )
    }));
  }

  function updateChoice(choiceId: string, text: string, nextSceneId: string = "") {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId 
          ? { 
              ...scene, 
              choices: scene.choices.map(choice => 
                choice.id === choiceId 
                  ? { ...choice, text, nextSceneId } 
                  : choice
              ) 
            } 
          : scene
      )
    }));
  }

  function deleteChoice(choiceId: string) {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId 
          ? { 
              ...scene, 
              choices: scene.choices.filter(choice => choice.id !== choiceId) 
            } 
          : scene
      )
    }));
  }

  function previewStory() {
    saveStory(form.getValues());
    navigate(`/admin/stories/${story.id}/preview`);
  }
};
