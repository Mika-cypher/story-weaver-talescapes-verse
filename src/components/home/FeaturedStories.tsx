
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Headphones, Heart } from "lucide-react";
import { useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";

// Mock data for featured stories
const featuredStories = [
  {
    id: 1,
    title: "The Crystal Cavern",
    excerpt: "Explore the depths of a magical cave where crystals hold ancient memories.",
    coverImage: "https://images.unsplash.com/photo-1633621477511-b1b3fb9a2280?q=80&w=2748&auto=format&fit=crop",
    category: "Fantasy",
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo audio URL
    likes: 243,
  },
  {
    id: 2,
    title: "Whispers of the Night",
    excerpt: "A detective story set in a world where dreams and reality blend together.",
    coverImage: "https://images.unsplash.com/photo-1520034475321-cbe63696469a?q=80&w=3000&auto=format&fit=crop",
    category: "Mystery",
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Demo audio URL
    likes: 178,
  },
  {
    id: 3,
    title: "Journey to Andromeda",
    excerpt: "Follow the first human expedition to the Andromeda galaxy.",
    coverImage: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?q=80&w=3540&auto=format&fit=crop",
    category: "Sci-Fi",
    hasAudio: false,
    likes: 312,
  },
];

const FeaturedStories = () => {
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);

  const toggleAudio = (storyId: number) => {
    if (activeAudioId === storyId) {
      setActiveAudioId(null);
    } else {
      setActiveAudioId(storyId);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Immerse yourself in our handpicked collection of extraordinary tales created by talented storytellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredStories.map((story) => (
            <Card key={story.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {story.category}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl line-clamp-1">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2">{story.excerpt}</p>
                
                {activeAudioId === story.id && story.hasAudio && story.audioSrc && (
                  <div className="mt-4">
                    <AudioPlayer audioSrc={story.audioSrc} title={story.title} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{story.likes}</span>
                  </div>
                  {story.hasAudio && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto"
                      onClick={() => toggleAudio(story.id)}
                    >
                      <Headphones className={`h-4 w-4 ${activeAudioId === story.id ? "text-primary" : ""}`} />
                    </Button>
                  )}
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
