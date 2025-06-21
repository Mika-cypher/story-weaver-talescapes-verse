
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Heart, Settings } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AudioPlayer from "@/components/AudioPlayer";
import StoryBackgroundControls from "@/components/StoryBackgroundControls";
import { Story } from "@/types/story";

interface StoryCardProps {
  story: Story;
  activeAudioId: string | null;
  openSettingsId: string | null;
  onToggleAudio: (storyId: string) => void;
  onToggleSettings: (storyId: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story,
  activeAudioId,
  openSettingsId,
  onToggleAudio,
  onToggleSettings
}) => {
  const hasAudio = story.scenes?.[0]?.audio;
  const firstSceneAudio = story.scenes?.[0]?.audio;

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
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-4 text-muted-foreground">
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-sm">0</span>
          </div>
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
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/story/${story.id}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            Read
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
