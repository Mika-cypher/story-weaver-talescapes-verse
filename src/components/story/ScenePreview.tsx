
import { StoryScene } from "@/types/story";
import { Button } from "@/components/ui/button";

interface ScenePreviewProps {
  currentScene: StoryScene;
}

export const ScenePreview = ({ currentScene }: ScenePreviewProps) => {
  return (
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
  );
};
