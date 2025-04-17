
import { StoryScene, StoryChoice } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SceneEditorProps {
  currentScene: StoryScene;
  scenes: StoryScene[];
  updateSceneTitle: (title: string) => void;
  updateSceneContent: (content: string) => void;
  updateChoice: (choiceId: string, text: string, nextSceneId: string) => void;
  removeChoice: (choiceId: string) => void;
  currentSceneId: string;
}

export const SceneEditor = ({
  currentScene,
  scenes,
  updateSceneTitle,
  updateSceneContent,
  updateChoice,
  removeChoice,
  currentSceneId
}: SceneEditorProps) => {
  return (
    <>
      <div className="mb-4">
        <Label htmlFor="scene-title">Scene Title</Label>
        <Input
          id="scene-title"
          placeholder="Scene title..."
          value={currentScene.title}
          onChange={(e) => updateSceneTitle(e.target.value)}
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
  );
};
