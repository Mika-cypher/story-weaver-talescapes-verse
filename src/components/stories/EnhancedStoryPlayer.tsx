import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Story, StoryScene } from "@/types/story";
import { storyService } from "@/services/storyService";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Home, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const EnhancedStoryPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [story, setStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const loadStory = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const loadedStory = await storyService.getStoryById(id);
        if (loadedStory && loadedStory.status === "published") {
          setStory(loadedStory);
          
          // Set starting scene
          const startScene = loadedStory.scenes.find(scene => scene.id === loadedStory.startSceneId);
          if (startScene) {
            setCurrentScene(startScene);
            setHistory([startScene.id]);
            setProgress(0);
          }
        } else {
          setError("Story not found or not published");
          navigate("/explore");
        }
      } catch (err) {
        console.error("Error loading story:", err);
        setError("Failed to load the story");
      } finally {
        setLoading(false);
      }
    };
    
    loadStory();
  }, [id, navigate]);

  useEffect(() => {
    if (story && history.length > 0) {
      const progressPercent = (history.length / story.scenes.length) * 100;
      setProgress(Math.min(progressPercent, 100));
    }
  }, [history, story]);

  const handleChoiceClick = (nextSceneId: string) => {
    if (story) {
      const nextScene = story.scenes.find(scene => scene.id === nextSceneId);
      if (nextScene) {
        setCurrentScene(nextScene);
        setHistory(prev => [...prev, nextSceneId]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousSceneId = newHistory[newHistory.length - 1];
      
      if (story) {
        const previousScene = story.scenes.find(scene => scene.id === previousSceneId);
        if (previousScene) {
          setCurrentScene(previousScene);
          setHistory(newHistory);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  const handleRestart = () => {
    if (story) {
      const startScene = story.scenes.find(scene => scene.id === story.startSceneId);
      if (startScene) {
        setCurrentScene(startScene);
        setHistory([startScene.id]);
        setProgress(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const toggleAudio = () => {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement) {
      if (audioPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  const toggleMute = () => {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement) {
      audioElement.muted = !audioMuted;
      setAudioMuted(!audioMuted);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-lg font-medium">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (error || !story || !currentScene) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-destructive/5 flex flex-col items-center justify-center text-center space-y-6">
        <h2 className="text-3xl font-bold">Story Not Found</h2>
        <p className="text-muted-foreground max-w-md">{error || "The story you're looking for doesn't exist or isn't published yet."}</p>
        <Button onClick={() => navigate("/explore")} size="lg">
          Explore Other Stories
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header with Progress */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/explore")}
                className="hover:bg-background/60"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{story.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Scene {history.length} of {story.scenes.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {currentScene.audio && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleMute}
                  >
                    {audioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleAudio}
                  >
                    {audioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGoBack}
                disabled={history.length <= 1}
              >
                Back
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRestart}
              >
                <Home className="mr-2 h-4 w-4" />
                Restart
              </Button>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            {/* Scene Image */}
            {currentScene.image && (
              <motion.div 
                className="relative w-full h-96 rounded-xl overflow-hidden mb-8 shadow-lg"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={currentScene.image} 
                  alt={currentScene.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h2 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
                  {currentScene.title}
                </h2>
              </motion.div>
            )}

            {/* Scene Content */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border">
              {!currentScene.image && (
                <h2 className="text-3xl font-bold mb-6 text-center">{currentScene.title}</h2>
              )}
              
              <div className="prose prose-lg max-w-none text-foreground leading-relaxed">
                {currentScene.content.split("\n").map((paragraph, index) => (
                  paragraph.trim() && (
                    <motion.p 
                      key={index} 
                      className="mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {paragraph}
                    </motion.p>
                  )
                ))}
              </div>
              
              {/* Audio Player */}
              {currentScene.audio && (
                <motion.div 
                  className="mt-8 p-4 bg-muted/50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <audio 
                    controls 
                    className="w-full"
                    onPlay={() => setAudioPlaying(true)}
                    onPause={() => setAudioPlaying(false)}
                    onEnded={() => setAudioPlaying(false)}
                  >
                    <source src={currentScene.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </motion.div>
              )}

              {/* Choices or Ending */}
              <div className="mt-12">
                {currentScene.isEnding ? (
                  <motion.div 
                    className="text-center space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">The End</h3>
                      <p className="text-muted-foreground">Thank you for experiencing this story</p>
                    </div>
                    <Button onClick={handleRestart} size="lg" className="px-8">
                      <Home className="mr-2 h-5 w-5" />
                      Experience Again
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-center">What will you choose?</h3>
                    <div className="grid gap-4">
                      {currentScene.choices.map((choice, index) => (
                        <motion.div
                          key={choice.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <Button 
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-4 px-6 bg-background/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                            onClick={() => handleChoiceClick(choice.nextSceneId)}
                          >
                            <span className="text-base">{choice.text}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};