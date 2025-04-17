
import { useState } from "react";
import { StoryScene } from "@/types/story";

interface SceneNavigatorProps {
  scenes: StoryScene[];
  currentSceneId: string | null;
  onSelectScene: (sceneId: string) => void;
}

export const SceneNavigator = ({ 
  scenes, 
  currentSceneId, 
  onSelectScene 
}: SceneNavigatorProps) => {
  return (
    <div className="border rounded-md p-2">
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
            onClick={() => onSelectScene(scene.id)}
          >
            {scene.title || "Untitled Scene"}
          </div>
        ))}
      </div>
    </div>
  );
};
