
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileImage, FileAudio, Upload } from "lucide-react";
import { SceneEditor } from "./SceneEditor";
import { ScenePreview } from "./ScenePreview";
import { StoryScene, StoryChoice } from "@/types/story";

interface StoryBuilderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentScene: StoryScene | undefined;
  scenes: StoryScene[];
  currentSceneId: string | null;
  updateSceneTitle: (title: string) => void;
  updateSceneContent: (content: string) => void;
  updateChoice: (choiceId: string, text: string, nextSceneId: string) => void;
  removeChoice: (choiceId: string) => void;
}

export const StoryBuilderTabs = ({
  activeTab,
  setActiveTab,
  currentScene,
  scenes,
  currentSceneId,
  updateSceneTitle,
  updateSceneContent,
  updateChoice,
  removeChoice,
}: StoryBuilderTabsProps) => (
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
);

