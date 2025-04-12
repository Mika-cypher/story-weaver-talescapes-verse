
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoryPlayer } from "@/components/stories/StoryPlayer";
import { storyService } from "@/services/storyService";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, isStorySaved, saveStory, unsaveStory } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (!id) {
      navigate("/explore");
      return;
    }
    
    const story = storyService.getStoryById(id);
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
  }, [id, isLoggedIn, isStorySaved]);
  
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
  
  return (
    <div className="relative">
      <StoryPlayer />
      
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
