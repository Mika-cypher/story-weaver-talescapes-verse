
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FileImage, FileAudio, Save, Eye, Upload, Plus, FlowChart, Play } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Story, StoryScene, StoryChoice } from "@/types/story";
import { storyService } from "@/services/storyService";

const Create = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Basic story details
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  
  // Story structure
  const [activeTab, setActiveTab] = useState("write");
  const [content, setContent] = useState("");
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

  // Get current scene
  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  // Update current scene content
  const updateSceneContent = (content: string) => {
    if (!currentSceneId) return;
    
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === currentSceneId ? { ...scene, content } : scene
      )
    );
  };

  // Add a new scene
  const addScene = () => {
    const newSceneId = uuidv4();
    const newScene: StoryScene = {
      id: newSceneId,
      title: `Scene ${scenes.length + 1}`,
      content: "",
      choices: [],
    };
    
    setScenes(prev => [...prev, newScene]);
    setCurrentSceneId(newSceneId);
    setActiveTab("write");
  };

  // Add a choice to the current scene
  const addChoice = () => {
    if (!currentSceneId) return;
    
    const newChoice: StoryChoice = {
      id: uuidv4(),
      text: "Make a choice...",
      nextSceneId: "",
    };
    
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === currentSceneId 
          ? { ...scene, choices: [...scene.choices, newChoice] } 
          : scene
      )
    );
  };

  // Update a choice
  const updateChoice = (choiceId: string, text: string, nextSceneId: string = "") => {
    if (!currentSceneId) return;
    
    setScenes(prevScenes => 
      prevScenes.map(scene => 
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
    );
  };

  // Remove a choice
  const removeChoice = (choiceId: string) => {
    if (!currentSceneId) return;
    
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === currentSceneId 
          ? { 
              ...scene, 
              choices: scene.choices.filter(choice => choice.id !== choiceId) 
            } 
          : scene
      )
    );
  };

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
    if (!title || !content) {
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
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Story Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Short Description</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Write a brief description of your story..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="scifi">Science Fiction</SelectItem>
                      <SelectItem value="historical">Historical</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="horror">Horror</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Story Structure</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={addScene}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Scene
                    </Button>
                    <Button variant="outline" size="sm" onClick={addChoice} disabled={!currentSceneId}>
                      <FlowChart className="h-4 w-4 mr-2" />
                      Add Choice
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Scene navigation sidebar */}
                  <div className="lg:col-span-1 border rounded-md p-2">
                    <h4 className="font-medium mb-2">Scenes</h4>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {scenes.map(scene => (
                        <div 
                          key={scene.id}
                          className={`p-2 rounded cursor-pointer text-sm ${
                            currentSceneId === scene.id 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setCurrentSceneId(scene.id)}
                        >
                          {scene.title || "Untitled Scene"}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scene content editor */}
                  <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="w-full">
                        <TabsTrigger value="write" className="flex-1">Write</TabsTrigger>
                        <TabsTrigger value="visuals" className="flex-1">Visuals</TabsTrigger>
                        <TabsTrigger value="audio" className="flex-1">Audio</TabsTrigger>
                        <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="write" className="mt-4">
                        {currentScene ? (
                          <>
                            <div className="mb-4">
                              <Label htmlFor="scene-title">Scene Title</Label>
                              <Input
                                id="scene-title"
                                placeholder="Scene title..."
                                value={currentScene.title}
                                onChange={(e) => {
                                  setScenes(prevScenes => 
                                    prevScenes.map(scene => 
                                      scene.id === currentSceneId 
                                        ? { ...scene, title: e.target.value } 
                                        : scene
                                    )
                                  );
                                }}
                                className="mt-1"
                              />
                            </div>
                            <Textarea
                              placeholder="Write your scene content here..."
                              value={currentScene.content}
                              onChange={(e) => updateSceneContent(e.target.value)}
                              className="min-h-[200px] resize-none"
                            />
                            
                            {/* Choices section */}
                            {currentScene.choices.length > 0 && (
                              <div className="mt-4 space-y-3">
                                <h4 className="font-medium">Choices</h4>
                                {currentScene.choices.map(choice => (
                                  <div key={choice.id} className="flex items-start space-x-2">
                                    <div className="flex-grow space-y-2">
                                      <Input
                                        placeholder="Choice text..."
                                        value={choice.text}
                                        onChange={(e) => updateChoice(choice.id, e.target.value, choice.nextSceneId)}
                                      />
                                      <Select 
                                        value={choice.nextSceneId} 
                                        onValueChange={(value) => updateChoice(choice.id, choice.text, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select destination scene" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {scenes
                                            .filter(scene => scene.id !== currentSceneId)
                                            .map(scene => (
                                              <SelectItem key={scene.id} value={scene.id}>
                                                {scene.title}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => removeChoice(choice.id)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            Select or create a scene to begin writing
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="visuals" className="mt-4">
                        <div className="text-center p-8 border-2 border-dashed border-muted rounded-md">
                          <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="font-medium text-lg mb-2">Add Visual Elements</h3>
                          <p className="text-muted-foreground mb-4">Upload images or illustrations to enhance your story</p>
                          <Button>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Images
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="audio" className="mt-4">
                        <div className="text-center p-8 border-2 border-dashed border-muted rounded-md">
                          <FileAudio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="font-medium text-lg mb-2">Add Audio Elements</h3>
                          <p className="text-muted-foreground mb-4">Upload narration, music, or sound effects for your story</p>
                          <Button>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Audio
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="preview" className="mt-4">
                        {currentScene ? (
                          <div className="bg-card rounded-lg p-6 shadow-inner">
                            <h2 className="text-2xl font-bold mb-4">{currentScene.title}</h2>
                            <div className="prose max-w-none mb-6">
                              {currentScene.content.split('\n').map((paragraph, i) => (
                                <p key={i} className="mb-4">{paragraph}</p>
                              ))}
                            </div>
                            
                            {currentScene.choices.length > 0 && (
                              <div className="space-y-2">
                                <h3 className="font-medium">What will you do?</h3>
                                {currentScene.choices.map(choice => (
                                  <Button 
                                    key={choice.id}
                                    variant="outline"
                                    className="w-full justify-start text-left h-auto py-3 px-4 mb-2"
                                    disabled={!choice.nextSceneId}
                                  >
                                    {choice.text}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Select a scene to preview.</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="outline" onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handlePublish}>
                    <Play className="h-4 w-4 mr-2" />
                    Publish Story
                  </Button>
                </div>
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
