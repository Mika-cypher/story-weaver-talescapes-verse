
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash, Plus } from "lucide-react";
import { StoryScene } from "@/types/story";

interface SceneSidebarProps {
  scenes: StoryScene[];
  startSceneId: string;
  currentSceneId: string;
  setCurrentSceneId: (id: string) => void;
  deleteScene: (id: string) => void;
  addScene: () => void;
}

export const SceneSidebar = ({
  scenes,
  startSceneId,
  currentSceneId,
  setCurrentSceneId,
  deleteScene,
  addScene
}: SceneSidebarProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Scenes</CardTitle>
      <CardDescription>Manage your story scenes</CardDescription>
    </CardHeader>
    <CardContent className="max-h-[600px] overflow-y-auto">
      <div className="space-y-2">
        {scenes.map(scene => (
          <div 
            key={scene.id} 
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
              scene.id === currentSceneId 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            } ${
              scene.id === startSceneId 
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
              onClick={e => { e.stopPropagation(); deleteScene(scene.id); }}
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
);
