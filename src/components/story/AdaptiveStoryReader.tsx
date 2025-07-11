
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Story, StoryScene } from "@/types/story";
import { storyService } from "@/services/storyService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";
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
  Contrast,
  Accessibility,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/services/accessibilityService";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [story, setStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCulturalPanel, setShowCulturalPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccessibilityControls, setShowAccessibilityControls] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  const { 
    settings: accessibilitySettings, 
    storySettings,
    announceSceneChange, 
    announceModeChange,
    announce,
    trapFocus,
    restoreFocus
  } = useAccessibility();

  const audioRef = useRef<HTMLAudioElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const culturalPanelRef = useRef<HTMLDivElement>(null);
  
  const [preferences, setPreferences] = useState<ReadingPreferences>({
    mode: 'multimedia',
    fontSize: 16,
    lineHeight: 1.6,
    contrast: false,
    darkMode: false,
    autoScroll: false,
    backgroundAudio: true
  });

  // Focus trap cleanup functions
  const focusTraps = useRef<(() => void)[]>([]);

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
            announceSceneChange(startScene.title);
          }
        }
      } catch (error) {
        console.error("Error loading story:", error);
        announce("Error loading story");
      } finally {
        setLoading(false);
      }
    };
    
    loadStory();
  }, [id, announceSceneChange, announce]);

  // Setup skip links
  useEffect(() => {
    if (storySettings.skipLinks && currentScene) {
      // Add skip links dynamically
      const skipLinks = [
        { id: 'story-content', text: 'Skip to story content' },
        { id: 'story-controls', text: 'Skip to story controls' },
        { id: 'story-settings', text: 'Skip to settings' }
      ];

      skipLinks.forEach(link => {
        const element = document.getElementById(link.id);
        if (element) {
          element.setAttribute('tabindex', '-1');
        }
      });
    }
  }, [storySettings.skipLinks, currentScene]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!storySettings.keyboardShortcuts) return;

      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();
          const modes: ReadingMode[] = ['text', 'audio', 'multimedia', 'immersive'];
          const newMode = modes[parseInt(event.key) - 1];
          if (newMode) {
            updatePreference('mode', newMode);
            announceModeChange(newMode);
          }
          break;
        case ' ':
          if (preferences.mode === 'audio' || preferences.mode === 'multimedia') {
            event.preventDefault();
            toggleAudio();
          }
          break;
        case 'Escape':
          event.preventDefault();
          closeAllPanels();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [storySettings.keyboardShortcuts, preferences.mode, announceModeChange]);

  // Cleanup focus traps
  useEffect(() => {
    return () => {
      focusTraps.current.forEach(cleanup => cleanup());
    };
  }, []);

  const updatePreference = <K extends keyof ReadingPreferences>(
    key: K,
    value: ReadingPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    if (key === 'mode') {
      announceModeChange(value as string);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
        announce("Audio paused");
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
        announce("Audio playing");
      }
    }
  };

  const closeAllPanels = () => {
    if (showSettings) {
      setShowSettings(false);
      restoreFocus();
      announce("Settings panel closed");
    }
    if (showCulturalPanel) {
      setShowCulturalPanel(false);
      restoreFocus();
      announce("Cultural context panel closed");
    }
    if (showAccessibilityControls) {
      setShowAccessibilityControls(false);
      restoreFocus();
      announce("Accessibility controls closed");
    }
  };

  const openSettingsPanel = () => {
    setShowSettings(true);
    announce("Settings panel opened");
    // Setup focus trap after state update
    setTimeout(() => {
      if (settingsPanelRef.current) {
        const cleanup = trapFocus(settingsPanelRef.current);
        focusTraps.current.push(cleanup);
      }
    }, 100);
  };

  const openCulturalPanel = () => {
    setShowCulturalPanel(true);
    announce("Cultural context panel opened");
    setTimeout(() => {
      if (culturalPanelRef.current) {
        const cleanup = trapFocus(culturalPanelRef.current);
        focusTraps.current.push(cleanup);
      }
    }, 100);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-purple" role="status" aria-label="Loading story"></div>
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
      {/* Skip Links */}
      <div className="sr-only">
        <a href="#story-content" className="skip-link">
          Skip to story content
        </a>
        <a href="#story-controls" className="skip-link">
          Skip to story controls
        </a>
        <a href="#story-settings" className="skip-link">
          Skip to settings
        </a>
      </div>

      {/* Header Controls */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b navigation-enhanced">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold truncate">{story.title}</h1>
            <Badge variant="outline" aria-label={`Current reading mode: ${preferences.mode}`}>
              {preferences.mode}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2" id="story-controls">
            <Button
              variant="outline"
              size="sm"
              onClick={openCulturalPanel}
              aria-label="Open cultural context panel"
              className="accessible-button"
            >
              <Info className="h-4 w-4 mr-2" />
              Context
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAccessibilityControls(true)}
              aria-label="Open accessibility controls"
              className="accessible-button"
              data-story-settings
            >
              <Accessibility className="h-4 w-4 mr-2" />
              Accessibility
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openSettingsPanel}
              aria-label="Open reading settings"
              className="accessible-button"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main 
          className="flex-1" 
          ref={mainContentRef}
          role="main"
          aria-label="Story content"
          id="story-content"
        >
          <div className="container py-8">
            {/* Reading Mode Selector */}
            <Tabs 
              value={preferences.mode} 
              onValueChange={(value) => updatePreference('mode', value as ReadingMode)}
              className="mb-8"
            >
              <TabsList 
                className="grid w-full grid-cols-4"
                role="tablist"
                aria-label="Reading mode selection"
              >
                {(['text', 'audio', 'multimedia', 'immersive'] as ReadingMode[]).map((mode, index) => {
                  const Icon = getModeIcon(mode);
                  return (
                    <TabsTrigger 
                      key={mode} 
                      value={mode} 
                      className="flex items-center accessible-button"
                      data-mode={mode}
                      aria-label={`Switch to ${mode} mode (Press ${index + 1})`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Text Mode */}
              <TabsContent 
                value="text"
                className="story-content-accessible"
                role="tabpanel"
                aria-labelledby="text-mode-tab"
              >
                <Card>
                  <CardHeader>
                    <CardTitle id="current-scene-title">{currentScene.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <article 
                      className={`prose max-w-none ${preferences.contrast ? 'contrast-more' : ''}`}
                      style={{
                        fontSize: `${preferences.fontSize}px`,
                        lineHeight: preferences.lineHeight
                      }}
                      aria-labelledby="current-scene-title"
                    >
                      {currentScene.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </article>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Audio Mode */}
              <TabsContent 
                value="audio"
                className="story-content-accessible"
                role="tabpanel"
                aria-labelledby="audio-mode-tab"
              >
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
                        <div className="flex items-center space-x-4">
                          <audio 
                            ref={audioRef}
                            controls 
                            className="w-full"
                            aria-label={`Audio narration for ${currentScene.title}`}
                            onPlay={() => setIsAudioPlaying(true)}
                            onPause={() => setIsAudioPlaying(false)}
                          >
                            <source src={currentScene.audio} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleAudio}
                            aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
                            data-audio-toggle
                            className="accessible-button"
                          >
                            {isAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                        {accessibilitySettings.captionsEnabled && (
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-2">Audio Transcript:</p>
                            <p className="text-sm">{currentScene.content}</p>
                          </div>
                        )}
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
              <TabsContent 
                value="multimedia"
                className="story-content-accessible"
                role="tabpanel"
                aria-labelledby="multimedia-mode-tab"
              >
                <Card>
                  {currentScene.image && (
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <img 
                        src={currentScene.image} 
                        alt={`Illustration for ${currentScene.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{currentScene.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <article 
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
                    </article>
                    
                    {currentScene.audio && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <audio 
                            ref={audioRef}
                            controls 
                            className="flex-1"
                            aria-label={`Audio narration for ${currentScene.title}`}
                            onPlay={() => setIsAudioPlaying(true)}
                            onPause={() => setIsAudioPlaying(false)}
                          >
                            <source src={currentScene.audio} type="audio/mpeg" />
                          </audio>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleAudio}
                            aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
                            data-audio-toggle
                            className="accessible-button"
                          >
                            {isAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Immersive Mode */}
              <TabsContent 
                value="immersive"
                className="story-content-accessible"
                role="tabpanel"
                aria-labelledby="immersive-mode-tab"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative min-h-screen"
                >
                  {currentScene.image && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${currentScene.image})` }}
                      role="img"
                      aria-label={`Background image for ${currentScene.title}`}
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
                        <article 
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
                        </article>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Cultural Context Panel */}
        <AnimatePresence>
          {showCulturalPanel && (
            <motion.aside
              ref={culturalPanelRef}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg z-40 overflow-y-auto panel-accessible"
              role="complementary"
              aria-labelledby="cultural-context-title"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 id="cultural-context-title" className="text-lg font-semibold">Cultural Context</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowCulturalPanel(false);
                      restoreFocus();
                      announce("Cultural context panel closed");
                    }}
                    aria-label="Close cultural context panel"
                    data-panel-close
                    className="accessible-button"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <section>
                    <h4 className="font-medium mb-2 text-cultural-gold">Historical Background</h4>
                    <p className="text-sm text-muted-foreground">
                      This story draws from rich cultural traditions that span centuries of oral storytelling.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-medium mb-2 text-cultural-gold">Cultural Significance</h4>
                    <p className="text-sm text-muted-foreground">
                      The narrative elements reflect important cultural values and traditional wisdom.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="font-medium mb-2 text-cultural-gold">Community Notes</h4>
                    <div className="space-y-2">
                      <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="font-medium">Reader Insight</p>
                        <p className="text-muted-foreground">This scene represents a common theme in traditional narratives...</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.aside
              ref={settingsPanelRef}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg z-40 overflow-y-auto panel-accessible"
              role="complementary"
              aria-labelledby="reading-settings-title"
              id="story-settings"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 id="reading-settings-title" className="text-lg font-semibold">Reading Settings</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowSettings(false);
                      restoreFocus();
                      announce("Settings panel closed");
                    }}
                    aria-label="Close reading settings panel"
                    data-panel-close
                    className="accessible-button"
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
                      onValueChange={([value]) => {
                        updatePreference('fontSize', value);
                        announce(`Font size set to ${value} pixels`);
                      }}
                      min={12}
                      max={24}
                      step={1}
                      className="w-full"
                      aria-label="Adjust font size"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {preferences.fontSize}px
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Line Height</label>
                    <Slider
                      value={[preferences.lineHeight]}
                      onValueChange={([value]) => {
                        updatePreference('lineHeight', value);
                        announce(`Line height set to ${value.toFixed(1)}`);
                      }}
                      min={1.2}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                      aria-label="Adjust line height"
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
                      onCheckedChange={(checked) => {
                        updatePreference('contrast', checked);
                        announce(`High contrast ${checked ? 'enabled' : 'disabled'}`);
                      }}
                      aria-label="Toggle high contrast mode"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </label>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => {
                        updatePreference('darkMode', checked);
                        announce(`Dark mode ${checked ? 'enabled' : 'disabled'}`);
                      }}
                      aria-label="Toggle dark mode"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Background Audio
                    </label>
                    <Switch
                      checked={preferences.backgroundAudio}
                      onCheckedChange={(checked) => {
                        updatePreference('backgroundAudio', checked);
                        announce(`Background audio ${checked ? 'enabled' : 'disabled'}`);
                      }}
                      aria-label="Toggle background audio"
                    />
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Accessibility Controls Modal */}
      <AccessibilityControls
        isOpen={showAccessibilityControls}
        onClose={() => {
          setShowAccessibilityControls(false);
          restoreFocus();
        }}
      />

      {/* Live region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="announcements"
      />
    </div>
  );
};
