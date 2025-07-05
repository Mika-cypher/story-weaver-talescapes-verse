
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EnhancedStoryPlayer } from "@/components/stories/EnhancedStoryPlayer";
import { storyService } from "@/services/storyService";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, isStorySaved, saveStory, unsaveStory } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkStory = async () => {
      setLoading(true);
      if (!id) {
        navigate("/explore");
        return;
      }
      
      try {
        const story = await storyService.getStoryById(id);
        if (!story) {
          toast({
            title: "Story not found",
            description: "The story you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate("/explore");
          return;
        }
        
        if (isLoggedIn) {
          setIsSaved(isStorySaved(id));
        }
      } catch (err) {
        console.error("Error checking story:", err);
        setError("Failed to load the story");
      } finally {
        setLoading(false);
      }
    };
    
    checkStory();
  }, [id, navigate, isLoggedIn, isStorySaved, toast]);
  
  const handleToggleSave = () => {
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save stories",
        variant: "destructive",
      });
      return;
    }
    
    if (!id) return;
    
    if (isSaved) {
      unsaveStory(id);
      setIsSaved(false);
    } else {
      saveStory(id);
      setIsSaved(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <Button onClick={() => navigate("/explore")}>
          Explore Stories
        </Button>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <EnhancedStoryPlayer />
      
      {isLoggedIn && (
        <div className="fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={handleToggleSave}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Story;
