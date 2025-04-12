
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

// We'll mock uuid for now since we can't install it in this environment
const uuid = {
  v4: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

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
    id: isNewStory ? uuid.v4() : id || "",
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
  
  const form = useForm<StoryFormData>({
    defaultValues: {
      title: story.title,
      description: story.description,
      coverImage: story.coverImage || "",
      author: story.author
    }
  });

  useEffect(() => {
    if (!isNewStory && id) {
      const existingStory = storyService.getStoryById(id);
      if (existingStory) {
        setStory(existingStory);
        form.reset({
          title: existingStory.title,
          description: existingStory.description,
          coverImage: existingStory.coverImage || "",
          author: existingStory.author
        });
        
        // Set current scene to the start scene if it exists
        if (existingStory.startSceneId && existingStory.scenes.length > 0) {
          setCurrentSceneId(existingStory.startSceneId);
        }
      } else {
        toast({
          title: "Story not found",
          description: "The story you're trying to edit doesn't exist",
          variant: "destructive"
        });
        navigate("/admin/stories");
      }
    } else if (isNewStory) {
      // Create first scene for new story
      const firstSceneId = uuid.v4();
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
  }, [id, isNewStory]);

  // Get current scene
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
      
      storyService.saveStory(updatedStory);
      
      toast({
        title: "Story saved",
        description: "Your story has been saved successfully",
      });
      
      if (isNewStory) {
        navigate(`/admin/stories/${updatedStory.id}/edit`);
      }
    } catch (error) {
      toast({
        title: "Error saving story",
        description: "There was an error saving your story",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addScene = () => {
    const newSceneId = uuid.v4();
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
  };

  const deleteScene = (sceneId: string) => {
    if (story.scenes.length <= 1) {
      toast({
        title: "Cannot delete scene",
        description: "A story must have at least one scene",
        variant: "destructive"
      });
      return;
    }
    
    // Check if it's the start scene
    if (sceneId === story.startSceneId) {
      toast({
        title: "Cannot delete start scene",
        description: "You cannot delete the starting scene. Set another scene as the start scene first.",
        variant: "destructive"
      });
      return;
    }
    
    // Update any choices that point to this scene
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
    
    // If we're deleting the current scene, switch to another one
    if (sceneId === currentSceneId) {
      setCurrentSceneId(updatedScenes[0]?.id || "");
    }
  };

  const updateSceneTitle = (title: string) => {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, title } : scene
      )
    }));
  };

  const updateSceneContent = (content: string) => {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, content } : scene
      )
    }));
  };

  const updateSceneImage = (image: string) => {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, image } : scene
      )
    }));
  };

  const updateSceneAudio = (audio: string) => {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, audio } : scene
      )
    }));
  };

  const toggleSceneEnding = () => {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, isEnding: !scene.isEnding } : scene
      )
    }));
  };

  const setAsStartScene = () => {
    if (!currentSceneId) return;
    
    setStory(prev => ({
      ...prev,
      startSceneId: currentSceneId
    }));
    
    toast({
      title: "Start scene set",
      description: "This scene is now the starting point of your story"
    });
  };

  const addChoice = () => {
    if (!currentSceneId) return;
    
    const newChoice: StoryChoice = {
      id: uuid.v4(),
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
  };

  const updateChoice = (choiceId: string, text: string, nextSceneId: string = "") => {
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
  };

  const deleteChoice = (choiceId: string) => {
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
  };

  const previewStory = () => {
    // First save the story
    saveStory(form.getValues());
    // Then navigate to preview
    navigate(`/admin/stories/${story.id}/preview`);
  };

  if (!story) return <div>Loading...</div>;

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
          <Card>
            <CardHeader>
              <CardTitle>Scenes</CardTitle>
              <CardDescription>Manage your story scenes</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              <div className="space-y-2">
                {story.scenes.map(scene => (
                  <div 
                    key={scene.id} 
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      scene.id === currentSceneId 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    } ${
                      scene.id === story.startSceneId 
                        ? "border-l-4 border-accent" 
                        : ""
                    }`}
                    onClick={() => setCurrentSceneId(scene.id)}
                  >
                    <div className="truncate">
                      {scene.title || "Untitled Scene"}
                      {scene.isEnding && (
                        <span className="ml-2 text-xs bg-accent px-1 py-0.5 rounded">
                          ENDING
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-6 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScene(scene.id);
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addScene} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Scene
              </Button>
            </CardFooter>
          </Card>
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Story Information</CardTitle>
                      <CardDescription>
                        Basic information about your interactive story
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the story title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter a short description of the story" 
                                className="resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Image URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/image.jpg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {currentScene && (
                  <TabsContent value="scene-editor" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center space-y-0">
                        <div className="flex-1">
                          <CardTitle>Scene Editor</CardTitle>
                          <CardDescription>
                            Edit the content and choices for this scene
                          </CardDescription>
                        </div>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={setAsStartScene}
                            disabled={currentSceneId === story.startSceneId}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Set as Start
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={toggleSceneEnding}
                          >
                            {currentScene.isEnding 
                              ? "Remove Ending Flag" 
                              : "Mark as Ending"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <FormLabel>Scene Title</FormLabel>
                          <Input 
                            placeholder="Enter a title for this scene" 
                            value={currentScene.title}
                            onChange={(e) => updateSceneTitle(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <FormLabel>Scene Content</FormLabel>
                          <Textarea 
                            placeholder="Write the story content for this scene..." 
                            className="min-h-[150px]"
                            value={currentScene.content}
                            onChange={(e) => updateSceneContent(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <FormLabel>Scene Image URL</FormLabel>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="https://example.com/image.jpg" 
                                value={currentScene.image || ""}
                                onChange={(e) => updateSceneImage(e.target.value)}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                type="button"
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <FormLabel>Scene Audio URL</FormLabel>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="https://example.com/audio.mp3" 
                                value={currentScene.audio || ""}
                                onChange={(e) => updateSceneAudio(e.target.value)}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                type="button"
                              >
                                <Music className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4">
                          <div className="flex items-center justify-between">
                            <FormLabel>Choices</FormLabel>
                            {!currentScene.isEnding && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={addChoice}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Choice
                              </Button>
                            )}
                          </div>

                          {currentScene.isEnding ? (
                            <div className="text-center p-4 bg-muted rounded-md">
                              <p>This is an ending scene. No choices are available.</p>
                            </div>
                          ) : currentScene.choices.length === 0 ? (
                            <div className="text-center p-4 bg-muted rounded-md">
                              <p>No choices yet. Add a choice to create a path from this scene.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {currentScene.choices.map((choice, index) => (
                                <Card key={choice.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium">Choice {index + 1}</h4>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => deleteChoice(choice.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <FormLabel>Choice Text</FormLabel>
                                        <Input 
                                          placeholder="What the reader will select" 
                                          value={choice.text}
                                          onChange={(e) => updateChoice(choice.id, e.target.value, choice.nextSceneId)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <FormLabel>Next Scene</FormLabel>
                                        <select 
                                          className="w-full rounded-md border border-input p-2"
                                          value={choice.nextSceneId}
                                          onChange={(e) => updateChoice(choice.id, choice.text, e.target.value)}
                                        >
                                          <option value="">Select a scene...</option>
                                          {story.scenes
                                            .filter(scene => scene.id !== currentSceneId)
                                            .map(scene => (
                                              <option key={scene.id} value={scene.id}>
                                                {scene.title || "Untitled Scene"}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
