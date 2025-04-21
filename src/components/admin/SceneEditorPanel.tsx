
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Play } from "lucide-react";
import { StoryScene, StoryChoice } from "@/types/story";

interface SceneEditorPanelProps {
  currentScene: StoryScene;
  scenes: StoryScene[];
  currentSceneId: string;
  startSceneId: string;
  setAsStartScene: () => void;
  toggleSceneEnding: () => void;
  updateSceneTitle: (title: string) => void;
  updateSceneContent: (content: string) => void;
  updateSceneImage: (image: string) => void;
  updateSceneAudio: (audio: string) => void;
  addChoice: () => void;
  updateChoice: (choiceId: string, text: string, nextSceneId: string) => void;
  deleteChoice: (choiceId: string) => void;
}

export const SceneEditorPanel = ({
  currentScene,
  scenes,
  currentSceneId,
  startSceneId,
  setAsStartScene,
  toggleSceneEnding,
  updateSceneTitle,
  updateSceneContent,
  updateSceneImage,
  updateSceneAudio,
  addChoice,
  updateChoice,
  deleteChoice
}: SceneEditorPanelProps) => {
  return (
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
            disabled={currentSceneId === startSceneId}
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
            onChange={e => updateSceneTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <FormLabel>Scene Content</FormLabel>
          <Textarea 
            placeholder="Write the story content for this scene..." 
            className="min-h-[150px]"
            value={currentScene.content}
            onChange={e => updateSceneContent(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Scene Image URL</FormLabel>
            <div className="flex space-x-2">
              <Input 
                placeholder="https://example.com/image.jpg" 
                value={currentScene.image || ""}
                onChange={e => updateSceneImage(e.target.value)}
              />
              {/* Button for preview/icon here if needed */}
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Scene Audio URL</FormLabel>
            <div className="flex space-x-2">
              <Input 
                placeholder="https://example.com/audio.mp3" 
                value={currentScene.audio || ""}
                onChange={e => updateSceneAudio(e.target.value)}
              />
              {/* Button for preview/icon here if needed */}
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
                          onChange={e => updateChoice(choice.id, e.target.value, choice.nextSceneId)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Next Scene</FormLabel>
                        <select 
                          className="w-full rounded-md border border-input p-2"
                          value={choice.nextSceneId}
                          onChange={e => updateChoice(choice.id, choice.text, e.target.value)}
                        >
                          <option value="">Select a scene...</option>
                          {scenes
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
  );
};
