
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Headphones, Heart, Settings, MessageSquare, User, Share, Users, Globe, Clock, Star } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import AudioPlayer from "@/components/AudioPlayer";
import StoryBackgroundControls from "@/components/StoryBackgroundControls";
import { Story } from "@/types/story";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface EnhancedStoryCardProps {
  story: Story;
  activeAudioId: string | null;
  openSettingsId: string | null;
  onToggleAudio: (storyId: string) => void;
  onToggleSettings: (storyId: string) => void;
  index?: number;
}

const EnhancedStoryCard: React.FC<EnhancedStoryCardProps> = ({
  story,
  activeAudioId,
  openSettingsId,
  onToggleAudio,
  onToggleSettings,
  index = 0
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

  const handleCollaborate = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request collaboration",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Collaboration request sent!",
      description: "Your collaboration request has been sent to the creator"
    });
  };

  const getCulturalBadgeColor = (category: string) => {
    const colors = {
      'folklore': 'bg-heritage-purple/10 text-heritage-purple border-heritage-purple/20',
      'historical': 'bg-cultural-gold/10 text-cultural-gold border-cultural-gold/20',
      'contemporary': 'bg-primary/10 text-primary border-primary/20',
      'poetry': 'bg-accent/10 text-accent-foreground border-accent/20',
    };
    return colors[category as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="story-card-enhanced h-full"
    >
      {/* Story Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={story.coverImage || "https://images.unsplash.com/photo-1633621477511-b1b3fb9a2280?q=80&w=2748&auto=format&fit=crop"}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay with badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {story.status}
          </Badge>
          {story.category && (
            <Badge className={getCulturalBadgeColor(story.category)}>
              <Globe className="h-3 w-3 mr-1" />
              {story.category}
            </Badge>
          )}
        </div>
        
        {/* Reading time badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
            <Clock className="h-3 w-3 mr-1" />
            5 min read
          </Badge>
        </div>

        {/* Featured/Trending indicator */}
        {story.featured && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-cultural-gold text-white">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Audio indicator */}
        {hasAudio && (
          <div className="absolute bottom-3 right-3">
            <Button
              size="sm"
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm hover:bg-heritage-purple hover:text-white"
              onClick={() => onToggleAudio(story.id)}
            >
              <Headphones className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Story Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-heritage-purple transition-colors">
              {story.title}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
              <Avatar className="h-6 w-6 border border-heritage-purple/20">
                <AvatarFallback className="bg-heritage-purple/10 text-heritage-purple text-xs">
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>Anonymous Creator</span>
              <span>•</span>
              <span>2 days ago</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        <p className="text-muted-foreground line-clamp-3 mb-4 story-text">
          {story.description || "An engaging story that explores cultural themes and traditions..."}
        </p>
        
        {/* Audio Player */}
        {activeAudioId === story.id && hasAudio && firstSceneAudio && (
          <div className="mb-4 p-3 bg-heritage-purple/5 rounded-lg border border-heritage-purple/20">
            <AudioPlayer audioSrc={firstSceneAudio} title={story.title} />
          </div>
        )}

        {/* Story Settings */}
        <Collapsible
          open={openSettingsId === story.id}
          onOpenChange={() => onToggleSettings(story.id)}
        >
          <CollapsibleContent>
            <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
              <StoryBackgroundControls storyId={story.id} storyTitle={story.title} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-2">
        {/* Engagement Stats */}
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto hover:text-red-500 transition-colors"
              onClick={handleLike}
            >
              <Heart className="h-4 w-4 mr-1" />
              <span>42</span>
            </Button>
            
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>12</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>156</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasAudio && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto hover:text-heritage-purple"
                onClick={() => onToggleAudio(story.id)}
              >
                <Headphones className={`h-4 w-4 ${activeAudioId === story.id ? "text-heritage-purple" : ""}`} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto hover:text-heritage-purple"
              onClick={() => onToggleSettings(story.id)}
            >
              <Settings className={`h-4 w-4 ${openSettingsId === story.id ? "text-heritage-purple" : ""}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto hover:text-heritage-purple"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center w-full gap-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-heritage-purple/10 hover:border-heritage-purple/30 hover:text-heritage-purple"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Discuss
            </Button>
            
            {story.status === 'published' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCollaborate}
                className="hover:bg-cultural-gold/10 hover:border-cultural-gold/30 hover:text-cultural-gold"
              >
                <Users className="h-4 w-4 mr-2" />
                Collaborate
              </Button>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="bg-heritage-purple hover:bg-heritage-purple/90 text-white px-6"
            asChild
          >
            <Link to={`/story/${story.id}`}>
              <BookOpen className="h-4 w-4 mr-2" />
              Read Story
            </Link>
          </Button>
        </div>
      </CardFooter>
    </motion.div>
  );
};

export default EnhancedStoryCard;
