
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Headphones, Heart, Settings, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import StoryBackgroundControls from "@/components/StoryBackgroundControls";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const FeaturedStories = () => {
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedStories = async () => {
      try {
        const stories = await storyService.getFeaturedStories();
        setFeaturedStories(stories.slice(0, 3)); // Show only 3 featured stories
      } catch (error) {
        console.error("Failed to load featured stories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedStories();
  }, []);

  const toggleAudio = (storyId: string) => {
    if (activeAudioId === storyId) {
      setActiveAudioId(null);
    } else {
      setActiveAudioId(storyId);
    }
  };

  const toggleSettings = (storyId: string) => {
    if (openSettingsId === storyId) {
      setOpenSettingsId(null);
    } else {
      setOpenSettingsId(storyId);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Immerse yourself in our handpicked collection of extraordinary tales created by talented storytellers.
            </p>
          </div>
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading featured stories...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Immerse yourself in our handpicked collection of extraordinary tales created by talented storytellers.
          </p>
        </div>

        {featuredStories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No featured stories available yet.</p>
            <Button variant="outline" asChild>
              <Link to="/explore">Explore All Stories</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStories.map((story) => (
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
                  <p className="text-muted-foreground line-clamp-2 mb-4">{story.description}</p>
                  
                  {activeAudioId === story.id && story.scenes?.[0]?.audio && (
                    <div className="mt-4">
                      <AudioPlayer audioSrc={story.scenes[0].audio} title={story.title} />
                    </div>
                  )}

                  <Collapsible
                    open={openSettingsId === story.id}
                    onOpenChange={() => toggleSettings(story.id)}
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
                    {story.scenes?.[0]?.audio && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto"
                        onClick={() => toggleAudio(story.id)}
                      >
                        <Headphones className={`h-4 w-4 ${activeAudioId === story.id ? "text-primary" : ""}`} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => toggleSettings(story.id)}
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
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/explore">Explore All Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
