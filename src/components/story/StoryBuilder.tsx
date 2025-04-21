
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StoryScene, StoryChoice } from "@/types/story";
import { Plus, GitBranch, FileImage, FileAudio, Upload } from "lucide-react";
import { SceneNavigator } from "./SceneNavigator";
import { SceneEditor } from "./SceneEditor";
import { ScenePreview } from "./ScenePreview";
import { v4 as uuidv4 } from "uuid";

interface StoryBuilderProps {
  scenes: StoryScene[];
  setScenes: React.Dispatch<React.SetStateAction<StoryScene[]>>;
  currentSceneId: string | null;
  setCurrentSceneId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const StoryBuilder = ({
  scenes,
  setScenes,
  currentSceneId,
  setCurrentSceneId,
  activeTab,
  setActiveTab
}: StoryBuilderProps) => {
  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  // Update current scene title
  const updateSceneTitle = (title: string) => {
    if (!currentSceneId) return;
    
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === currentSceneId 
          ? { ...scene, title } 
          : scene
      )
    );
  };

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Scene navigation sidebar */}
      <div className="lg:col-span-1">
        <SceneNavigator 
          scenes={scenes}
          currentSceneId={currentSceneId}
          onSelectScene={(sceneId) => setCurrentSceneId(sceneId)}
        />
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
              <SceneEditor 
                currentScene={currentScene}
                scenes={scenes}
                updateSceneTitle={updateSceneTitle}
                updateSceneContent={updateSceneContent}
                updateChoice={updateChoice}
                removeChoice={removeChoice}
                currentSceneId={currentSceneId!}
              />
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
              <ScenePreview currentScene={currentScene} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Select a scene to preview.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Story Structure</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={addScene}>
            <Plus className="h-4 w-4 mr-2" />
            Add Scene
          </Button>
          <Button variant="outline" size="sm" onClick={addChoice} disabled={!currentSceneId}>
            <GitBranch className="h-4 w-4 mr-2" />
            Add Choice
          </Button>
        </div>
      </div>
    </div>
  );
};
