
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Headphones, Heart, Settings, MessageSquare, User, Share } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AudioPlayer from "@/components/AudioPlayer";
import StoryBackgroundControls from "@/components/StoryBackgroundControls";
import { Story } from "@/types/story";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EnhancedStoryCardProps {
  story: Story;
  activeAudioId: string | null;
  openSettingsId: string | null;
  onToggleAudio: (storyId: string) => void;
  onToggleSettings: (storyId: string) => void;
}

const EnhancedStoryCard: React.FC<EnhancedStoryCardProps> = ({
  story,
  activeAudioId,
  openSettingsId,
  onToggleAudio,
  onToggleSettings
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const hasAudio = story.scenes?.[0]?.audio;
  const firstSceneAudio = story.scenes?.[0]?.audio;

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like stories",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Liked!",
      description: "You liked this story"
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: story.title,
        text: story.description || '',
        url: `${window.location.origin}/story/${story.id}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/story/${story.id}`);
      toast({
        title: "Link copied!",
        description: "Story link copied to clipboard"
      });
    }
  };

  return (
    <Card 
      key={story.id} 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
      id={`story-card-${story.id}`}
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={story.coverImage || "https://images.unsplash.com/photo-1633621477511-b1b3fb9a2280?q=80&w=2748&auto=format&fit=crop"}
          alt={story.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {story.status}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1">{story.title}</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span>Author</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4">{story.description || "No description available"}</p>
        
        {activeAudioId === story.id && hasAudio && firstSceneAudio && (
          <div className="mt-4">
            <AudioPlayer audioSrc={firstSceneAudio} title={story.title} />
          </div>
        )}

        <Collapsible
          open={openSettingsId === story.id}
          onOpenChange={() => onToggleSettings(story.id)}
          className="mt-4"
        >
          <CollapsibleContent>
            <StoryBackgroundControls storyId={story.id} storyTitle={story.title} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-4 text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto hover:text-red-500"
              onClick={handleLike}
            >
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">0</span>
            </Button>
            {hasAudio && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto"
                onClick={() => onToggleAudio(story.id)}
              >
                <Headphones className={`h-4 w-4 ${activeAudioId === story.id ? "text-primary" : ""}`} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              onClick={() => onToggleSettings(story.id)}
            >
              <Settings className={`h-4 w-4 ${openSettingsId === story.id ? "text-primary" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center w-full gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discuss
          </Button>
          <Button size="sm" variant="default" asChild>
            <Link to={`/story/${story.id}`}>
              <BookOpen className="h-4 w-4 mr-2" />
              Read
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedStoryCard;
