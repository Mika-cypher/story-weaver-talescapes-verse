import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StoryScene, StoryChoice } from "@/types/story";
import { Plus, GitBranch, FileImage, FileAudio, Upload } from "lucide-react";
import { SceneNavigator } from "./SceneNavigator";
import { SceneEditor } from "./SceneEditor";
import { ScenePreview } from "./ScenePreview";
import { v4 as uuidv4 } from "uuid";
import { StoryStructureFooter } from "./StoryStructureFooter";
import { StoryBuilderTabs } from "./StoryBuilderTabs";

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

      {/* Scene content editor, visuals, audio, preview */}
      <div className="lg:col-span-3">
        <StoryBuilderTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentScene={currentScene}
          scenes={scenes}
          currentSceneId={currentSceneId}
          updateSceneTitle={updateSceneTitle}
          updateSceneContent={updateSceneContent}
          updateChoice={updateChoice}
          removeChoice={removeChoice}
        />
      </div>

      <StoryStructureFooter
        addScene={addScene}
        addChoice={addChoice}
        currentSceneId={currentSceneId}
      />
    </div>
  );
};
