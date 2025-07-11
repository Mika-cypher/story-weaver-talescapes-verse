
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Story, StoryScene } from "@/types/story";
import { storyService } from "@/services/storyService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  BookOpen, 
  Headphones, 
  Image as ImageIcon, 
  Volume2, 
  Settings,
  Info,
  Palette,
  Type,
  Moon,
  Sun,
  Contrast
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ReadingMode = 'text' | 'audio' | 'multimedia' | 'immersive';

interface ReadingPreferences {
  mode: ReadingMode;
  fontSize: number;
  lineHeight: number;
  contrast: boolean;
  darkMode: boolean;
  autoScroll: boolean;
  backgroundAudio: boolean;
}

export const AdaptiveStoryReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCulturalPanel, setShowCulturalPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [preferences, setPreferences] = useState<ReadingPreferences>({
    mode: 'multimedia',
    fontSize: 16,
    lineHeight: 1.6,
    contrast: false,
    darkMode: false,
    autoScroll: false,
    backgroundAudio: true
  });

  useEffect(() => {
    const loadStory = async () => {
      if (!id) return;
      
      try {
        const loadedStory = await storyService.getStoryById(id);
        if (loadedStory) {
          setStory(loadedStory);
          const startScene = loadedStory.scenes.find(scene => scene.id === loadedStory.startSceneId);
          if (startScene) {
            setCurrentScene(startScene);
          }
        }
      } catch (error) {
        console.error("Error loading story:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStory();
  }, [id]);

  const updatePreference = <K extends keyof ReadingPreferences>(
    key: K,
    value: ReadingPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const getModeIcon = (mode: ReadingMode) => {
    switch (mode) {
      case 'text': return BookOpen;
      case 'audio': return Headphones;
      case 'multimedia': return ImageIcon;
      case 'immersive': return Palette;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-purple"></div>
      </div>
    );
  }

  if (!story || !currentScene) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Story Not Found</h2>
        <p className="text-muted-foreground">The story you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header Controls */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold truncate">{story.title}</h1>
            <Badge variant="outline">{preferences.mode}</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCulturalPanel(!showCulturalPanel)}
            >
              <Info className="h-4 w-4 mr-2" />
              Context
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          <div className="container py-8">
            {/* Reading Mode Selector */}
            <Tabs 
              value={preferences.mode} 
              onValueChange={(value) => updatePreference('mode', value as ReadingMode)}
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-4">
                {(['text', 'audio', 'multimedia', 'immersive'] as ReadingMode[]).map((mode) => {
                  const Icon = getModeIcon(mode);
                  return (
                    <TabsTrigger key={mode} value={mode} className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Text Mode */}
              <TabsContent value="text">
                <Card>
                  <CardHeader>
                    <CardTitle>{currentScene.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className={`prose max-w-none ${preferences.contrast ? 'contrast-more' : ''}`}
                      style={{
                        fontSize: `${preferences.fontSize}px`,
                        lineHeight: preferences.lineHeight
                      }}
                    >
                      {currentScene.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Audio Mode */}
              <TabsContent value="audio">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Headphones className="h-5 w-5 mr-2" />
                      {currentScene.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentScene.audio ? (
                      <div className="space-y-4">
                        <audio controls className="w-full">
                          <source src={currentScene.audio} type="audio/mpeg" />
                        </audio>
                        <div className="text-sm text-muted-foreground">
                          Audio narration available for this scene
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Headphones className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Audio narration not available for this scene</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Multimedia Mode */}
              <TabsContent value="multimedia">
                <Card>
                  {currentScene.image && (
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <img 
                        src={currentScene.image} 
                        alt={currentScene.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{currentScene.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div 
                      className={`prose max-w-none ${preferences.contrast ? 'contrast-more' : ''}`}
                      style={{
                        fontSize: `${preferences.fontSize}px`,
                        lineHeight: preferences.lineHeight
                      }}
                    >
                      {currentScene.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    {currentScene.audio && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <audio controls className="w-full">
                          <source src={currentScene.audio} type="audio/mpeg" />
                        </audio>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Immersive Mode */}
              <TabsContent value="immersive">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative min-h-screen"
                >
                  {currentScene.image && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${currentScene.image})` }}
                    >
                      <div className="absolute inset-0 bg-black/60" />
                    </div>
                  )}
                  
                  <div className="relative z-10 p-8">
                    <div className="max-w-4xl mx-auto">
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-bold text-white mb-8 text-center"
                      >
                        {currentScene.title}
                      </motion.h2>
                      
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-md rounded-lg p-8"
                      >
                        <div 
                          className="prose prose-lg prose-invert max-w-none"
                          style={{
                            fontSize: `${preferences.fontSize + 2}px`,
                            lineHeight: preferences.lineHeight
                          }}
                        >
                          {currentScene.content.split('\n').map((paragraph, index) => (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="mb-6"
                            >
                              {paragraph}
                            </motion.p>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Cultural Context Panel */}
        <AnimatePresence>
          {showCulturalPanel && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg z-40 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Cultural Context</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowCulturalPanel(false)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2 text-cultural-gold">Historical Background</h4>
                    <p className="text-sm text-muted-foreground">
                      This story draws from rich cultural traditions that span centuries of oral storytelling.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-cultural-gold">Cultural Significance</h4>
                    <p className="text-sm text-muted-foreground">
                      The narrative elements reflect important cultural values and traditional wisdom.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-cultural-gold">Community Notes</h4>
                    <div className="space-y-2">
                      <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="font-medium">Reader Insight</p>
                        <p className="text-muted-foreground">This scene represents a common theme in traditional narratives...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg z-40 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Reading Settings</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      <Type className="h-4 w-4 inline mr-2" />
                      Font Size
                    </label>
                    <Slider
                      value={[preferences.fontSize]}
                      onValueChange={([value]) => updatePreference('fontSize', value)}
                      min={12}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {preferences.fontSize}px
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Line Height</label>
                    <Slider
                      value={[preferences.lineHeight]}
                      onValueChange={([value]) => updatePreference('lineHeight', value)}
                      min={1.2}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {preferences.lineHeight.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Contrast className="h-4 w-4 mr-2" />
                      High Contrast
                    </label>
                    <Switch
                      checked={preferences.contrast}
                      onCheckedChange={(checked) => updatePreference('contrast', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </label>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => updatePreference('darkMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Background Audio
                    </label>
                    <Switch
                      checked={preferences.backgroundAudio}
                      onCheckedChange={(checked) => updatePreference('backgroundAudio', checked)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
