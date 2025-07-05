import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image, 
  Music, 
  Type, 
  Settings, 
  Eye, 
  Save, 
  Upload,
  Play,
  Pause,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryScene } from "@/types/story";
import { EnhancedChoiceEditor, Choice } from "./EnhancedChoiceEditor";

interface EnhancedSceneEditorProps {
  scene: StoryScene;
  availableScenes: Array<{ id: string; title: string }>;
  onSceneUpdate: (updates: Partial<StoryScene>) => void;
  onSave: () => void;
  isPreviewMode?: boolean;
  onPreviewToggle: () => void;
}

export const EnhancedSceneEditor: React.FC<EnhancedSceneEditorProps> = ({
  scene,
  availableScenes,
  onSceneUpdate,
  onSave,
  isPreviewMode = false,
  onPreviewToggle
}) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  const handleChoicesUpdate = (choices: Choice[]) => {
    onSceneUpdate({
      choices: choices.map(choice => ({
        id: choice.id,
        text: choice.text,
        nextSceneId: choice.nextSceneId
      }))
    });
  };

  const toggleAudio = () => {
    const audioElement = document.querySelector(`#scene-audio-${scene.id}`) as HTMLAudioElement;
    if (audioElement) {
      if (audioPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  if (isPreviewMode) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviewToggle}
            className="absolute top-4 right-4"
          >
            <X className="mr-2 h-4 w-4" />
            Exit Preview
          </Button>
          {scene.image && (
            <div className="w-full h-64 rounded-lg overflow-hidden mb-4">
              <img 
                src={scene.image} 
                alt={scene.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardTitle className="text-2xl">{scene.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            {scene.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>

          {scene.audio && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <audio 
                id={`scene-audio-${scene.id}`}
                controls 
                className="w-full"
                onPlay={() => setAudioPlaying(true)}
                onPause={() => setAudioPlaying(false)}
              >
                <source src={scene.audio} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {scene.choices.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What will you choose?</h3>
              <div className="grid gap-3">
                {scene.choices.map((choice, index) => (
                  <Button 
                    key={choice.id}
                    variant="outline"
                    className="justify-start text-left h-auto py-4 px-6"
                  >
                    <span className="text-base">{choice.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {scene.isEnding && (
            <div className="text-center py-8 border-2 border-dashed border-primary/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">The End</h3>
              <p className="text-muted-foreground">This scene marks the end of the story</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Type className="mr-2 h-5 w-5" />
            Scene Editor
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onPreviewToggle}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={onSave} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Scene
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">
              <Type className="mr-2 h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media">
              <Image className="mr-2 h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="choices">
              <Settings className="mr-2 h-4 w-4" />
              Choices
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-6"
            >
              <TabsContent value="content" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Scene Title
                  </label>
                  <Input
                    value={scene.title}
                    onChange={(e) => onSceneUpdate({ title: e.target.value })}
                    placeholder="Enter scene title..."
                    className="text-lg font-medium"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Scene Content
                    <span className="text-xs text-muted-foreground ml-2">
                      ({scene.content.length} characters)
                    </span>
                  </label>
                  <Textarea
                    value={scene.content}
                    onChange={(e) => onSceneUpdate({ content: e.target.value })}
                    placeholder="Write your scene content here..."
                    className="min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Use paragraph breaks for better readability. Each new line creates a new paragraph.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Scene Image
                  </label>
                  <div className="space-y-3">
                    {scene.image ? (
                      <div className="relative">
                        <img 
                          src={scene.image} 
                          alt="Scene visual"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => onSceneUpdate({ image: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          No image selected
                        </p>
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Scene Audio
                  </label>
                  <div className="space-y-3">
                    {scene.audio ? (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Audio Track</span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleAudio}
                            >
                              {audioPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onSceneUpdate({ audio: "" })}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <audio 
                          id={`scene-audio-${scene.id}`}
                          controls 
                          className="w-full"
                          onPlay={() => setAudioPlaying(true)}
                          onPause={() => setAudioPlaying(false)}
                        >
                          <source src={scene.audio} type="audio/mpeg" />
                        </audio>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Music className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          No audio selected
                        </p>
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Audio
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="choices">
                <EnhancedChoiceEditor
                  choices={scene.choices.map(choice => ({
                    id: choice.id,
                    text: choice.text,
                    nextSceneId: choice.nextSceneId
                  }))}
                  availableScenes={availableScenes}
                  onChoicesChange={handleChoicesUpdate}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">
                        Ending Scene
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Mark this scene as a story ending
                      </p>
                    </div>
                    <Switch
                      checked={scene.isEnding}
                      onCheckedChange={(checked) => onSceneUpdate({ isEnding: checked })}
                    />
                  </div>

                  {scene.isEnding && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-center">
                        <Badge variant="secondary" className="mr-2">
                          Ending Scene
                        </Badge>
                        <span className="text-sm">
                          This scene will conclude the story
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Scene Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Word Count:</span>
                      <span className="font-medium ml-2">
                        {scene.content.split(/\s+/).filter(word => word.length > 0).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Choices:</span>
                      <span className="font-medium ml-2">{scene.choices.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Has Image:</span>
                      <span className="font-medium ml-2">{scene.image ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Has Audio:</span>
                      <span className="font-medium ml-2">{scene.audio ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
};