
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Story, StoryScene } from "@/types/story";
import { storyService } from "@/services/storyService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";

export const StoryPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [story, setStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const loadedStory = storyService.getStoryById(id);
      if (loadedStory && loadedStory.status === "published") {
        setStory(loadedStory);
        
        // Set starting scene
        const startScene = loadedStory.scenes.find(scene => scene.id === loadedStory.startSceneId);
        if (startScene) {
          setCurrentScene(startScene);
          setHistory([startScene.id]);
        }
      } else {
        navigate("/explore");
      }
      setLoading(false);
    }
  }, [id]);

  const handleChoiceClick = (nextSceneId: string) => {
    if (story) {
      const nextScene = story.scenes.find(scene => scene.id === nextSceneId);
      if (nextScene) {
        setCurrentScene(nextScene);
        setHistory(prev => [...prev, nextSceneId]);
        
        // Scroll to top when changing scenes
        window.scrollTo(0, 0);
      }
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current scene
      const previousSceneId = newHistory[newHistory.length - 1];
      
      if (story) {
        const previousScene = story.scenes.find(scene => scene.id === previousSceneId);
        if (previousScene) {
          setCurrentScene(previousScene);
          setHistory(newHistory);
          
          // Scroll to top when changing scenes
          window.scrollTo(0, 0);
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
        
        // Scroll to top when restarting
        window.scrollTo(0, 0);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p>Loading story...</p>
      </div>
    );
  }

  if (!story || !currentScene) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Story Not Found</h2>
        <p className="mb-6">The story you're looking for doesn't exist or isn't published yet.</p>
        <Button onClick={() => navigate("/explore")}>
          Explore Other Stories
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/explore")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{story.title}</h1>
        </div>
        <div className="space-x-2">
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

      <div className="flex justify-center">
        <Card className="w-full max-w-2xl glass-card">
          <CardHeader>
            <CardTitle>{currentScene.title}</CardTitle>
          </CardHeader>
          
          {currentScene.image && (
            <div className="px-6">
              <div className="w-full h-64 rounded-md overflow-hidden">
                <img 
                  src={currentScene.image} 
                  alt={currentScene.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
              </div>
            </div>
          )}
          
          <CardContent className="py-6">
            <div className="prose prose-sm max-w-none">
              {currentScene.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {currentScene.audio && (
              <div className="mt-4">
                <audio controls className="w-full">
                  <source src={currentScene.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col">
            {currentScene.isEnding ? (
              <div className="text-center w-full py-4">
                <p className="text-lg font-semibold mb-4">The End</p>
                <Button onClick={handleRestart}>
                  <Home className="mr-2 h-4 w-4" />
                  Restart Story
                </Button>
              </div>
            ) : (
              <div className="w-full space-y-3">
                <p className="text-sm font-medium mb-2">What will you do?</p>
                {currentScene.choices.map(choice => (
                  <Button 
                    key={choice.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4 hover-scale"
                    onClick={() => handleChoiceClick(choice.nextSceneId)}
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
