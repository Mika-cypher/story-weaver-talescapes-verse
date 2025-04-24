
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { storyService } from "@/services/storyService";
import { Story, StoryScene } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Home, Loader2 } from "lucide-react";

const StoryPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [story, setStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadStory = async () => {
      if (id) {
        setLoading(true);
        try {
          const loadedStory = await storyService.getStoryById(id);
          if (loadedStory) {
            setStory(loadedStory);
            
            // Set starting scene
            const startScene = loadedStory.scenes.find(scene => scene.id === loadedStory.startSceneId);
            if (startScene) {
              setCurrentScene(startScene);
              setHistory([startScene.id]);
            }
          } else {
            setError("Story not found");
            navigate("/admin/stories");
          }
        } catch (err) {
          console.error("Error loading story:", err);
          setError("Failed to load the story");
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadStory();
  }, [id, navigate]);

  const handleChoiceClick = (nextSceneId: string) => {
    if (story) {
      const nextScene = story.scenes.find(scene => scene.id === nextSceneId);
      if (nextScene) {
        setCurrentScene(nextScene);
        setHistory(prev => [...prev, nextSceneId]);
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
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading story...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !story || !currentScene) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error || "Story not found"}</p>
          <Button onClick={() => navigate("/admin/stories")}>
            Back to Stories
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/admin/stories")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Story Preview: {story.title}
            </h1>
            <p className="text-muted-foreground">
              This is how your story will appear to readers
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/admin/stories/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Story
          </Button>
        </div>
      </div>

      <div className="flex justify-center py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{currentScene.title}</CardTitle>
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
          </CardHeader>
          
          {currentScene.image && (
            <div className="px-6">
              <div className="w-full h-48 rounded-md overflow-hidden">
                <img 
                  src={currentScene.image} 
                  alt={currentScene.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          )}
          
          <CardContent className="py-4">
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
              <div className="w-full space-y-2">
                <p className="text-sm font-medium mb-2">What will you do?</p>
                {currentScene.choices.length > 0 ? (
                  currentScene.choices.map(choice => (
                    <Button 
                      key={choice.id}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4"
                      onClick={() => handleChoiceClick(choice.nextSceneId)}
                      disabled={!choice.nextSceneId}
                    >
                      {choice.text}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic py-2">
                    No choices available. Edit this scene to add choices.
                  </p>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default StoryPreview;
