
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Headphones, Heart, Search, Filter, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import StoryBackgroundControls from "@/components/StoryBackgroundControls";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock data for stories
const allStories = [
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
  {
    id: 4,
    title: "The Last Oracle",
    excerpt: "In a world where magic is dying, the last oracle embarks on a perilous journey.",
    coverImage: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=3540&auto=format&fit=crop",
    category: "Fantasy",
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // Demo audio URL
    likes: 187,
  },
  {
    id: 5,
    title: "Echoes of Yesterday",
    excerpt: "A historical tale spanning generations of a family caught in the tides of war.",
    coverImage: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=3474&auto=format&fit=crop",
    category: "Historical",
    hasAudio: false,
    likes: 156,
  },
  {
    id: 6,
    title: "Midnight in the Garden",
    excerpt: "A suspenseful tale of intrigue and betrayal in a small town.",
    coverImage: "https://images.unsplash.com/photo-1502675135487-e971002a6adb?q=80&w=3538&auto=format&fit=crop",
    category: "Mystery",
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", // Demo audio URL
    likes: 201,
  },
];

const categories = ["All", "Fantasy", "Mystery", "Sci-Fi", "Historical", "Adventure"];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<number | null>(null);

  const filteredStories = allStories.filter(story => {
    if (selectedCategory !== "All" && story.category !== selectedCategory) {
      return false;
    }
    
    if (searchTerm && !story.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !story.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const toggleAudio = (storyId: number) => {
    if (activeAudioId === storyId) {
      setActiveAudioId(null);
    } else {
      setActiveAudioId(storyId);
    }
  };

  const toggleSettings = (storyId: number) => {
    if (openSettingsId === storyId) {
      setOpenSettingsId(null);
    } else {
      setOpenSettingsId(storyId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Explore Stories</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover immersive stories created by our community of storytellers.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search stories..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2 items-center">
                <Filter size={18} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter:</span>
                <Tabs defaultValue="All" className="w-[300px]" onValueChange={setSelectedCategory}>
                  <TabsList className="w-full overflow-x-auto">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story) => (
                <Card 
                  key={story.id} 
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                  id={`story-card-${story.id}`}
                >
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
                    <p className="text-muted-foreground line-clamp-2 mb-4">{story.excerpt}</p>
                    
                    {activeAudioId === story.id && story.hasAudio && story.audioSrc && (
                      <div className="mt-4">
                        <AudioPlayer audioSrc={story.audioSrc} title={story.title} />
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
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No stories found matching your search criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
