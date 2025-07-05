
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, Globe } from "lucide-react";
import { StoryList } from "@/components/stories/StoryList";
import AudioLibraryTab from "@/components/explore/AudioLibraryTab";
import { CreatorMedia } from "@/services/mediaService";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [audioSearchTerm, setAudioSearchTerm] = useState("");

  // Sample audio data to simulate community content
  const sampleAudioMedia: CreatorMedia[] = [
    {
      id: "audio-1",
      title: "Ancient Folklore Narration",
      description: "A beautiful narration of traditional folklore passed down through generations",
      file_url: "https://example.com/audio1.mp3",
      media_type: "audio",
      user_id: "user-1",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      tags: ["folklore", "narration", "traditional"],
      category: "folklore",
      is_public: true,
      is_featured: true
    },
    {
      id: "audio-2", 
      title: "Modern Poetry Reading",
      description: "Contemporary poetry with emotional depth and modern themes",
      file_url: "https://example.com/audio2.mp3",
      media_type: "audio",
      user_id: "user-2",
      created_at: "2024-01-16T14:30:00Z",
      updated_at: "2024-01-16T14:30:00Z",
      tags: ["poetry", "modern", "emotional"],
      category: "poetry",
      is_public: true,
      is_featured: false
    },
    {
      id: "audio-3",
      title: "Historical Chronicles",
      description: "Engaging historical accounts brought to life through voice",
      file_url: "https://example.com/audio3.mp3", 
      media_type: "audio",
      user_id: "user-3",
      created_at: "2024-01-17T09:15:00Z",
      updated_at: "2024-01-17T09:15:00Z",
      tags: ["history", "chronicles", "educational"],
      category: "historical",
      is_public: true,
      is_featured: true
    },
    {
      id: "audio-4",
      title: "Ambient Story Soundscape",
      description: "Atmospheric audio that complements storytelling with natural sounds",
      file_url: "https://example.com/audio4.mp3",
      media_type: "audio", 
      user_id: "user-4",
      created_at: "2024-01-18T16:45:00Z",
      updated_at: "2024-01-18T16:45:00Z",
      tags: ["ambient", "soundscape", "atmosphere"],
      category: "mixed-media",
      is_public: true,
      is_featured: false
    },
    {
      id: "audio-5",
      title: "Children's Bedtime Stories",
      description: "Gentle and soothing narrations perfect for bedtime",
      file_url: "https://example.com/audio5.mp3",
      media_type: "audio",
      user_id: "user-5", 
      created_at: "2024-01-19T20:00:00Z",
      updated_at: "2024-01-19T20:00:00Z",
      tags: ["children", "bedtime", "soothing"],
      category: "story",
      is_public: true,
      is_featured: true
    },
    {
      id: "audio-6",
      title: "Cultural Music & Chants",
      description: "Traditional musical pieces and cultural chants from around the world",
      file_url: "https://example.com/audio6.mp3",
      media_type: "audio",
      user_id: "user-6",
      created_at: "2024-01-20T11:30:00Z", 
      updated_at: "2024-01-20T11:30:00Z",
      tags: ["music", "cultural", "traditional"],
      category: "other",
      is_public: true,
      is_featured: false
    }
  ];

  const categories = [
    { id: "all", label: "All", icon: Globe },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "community", label: "Community", icon: Users },
  ];

  const filteredAudioMedia = sampleAudioMedia.filter(media => {
    const matchesSearch = !audioSearchTerm || 
      media.title.toLowerCase().includes(audioSearchTerm.toLowerCase()) ||
      media.description?.toLowerCase().includes(audioSearchTerm.toLowerCase()) ||
      media.tags?.some(tag => tag.toLowerCase().includes(audioSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Explore & Connect
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing stories, audio narrations, and connect with creators from our vibrant community
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories, audio, creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="stories" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="stories" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Stories
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Audio Library
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="stories" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Community Stories
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Discover what others are creating
                </span>
              </div>
            </div>
            <StoryList searchTerm={searchTerm} selectedCategory={selectedCategory} />
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Audio Community
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Listen to narrations and soundscapes
                </span>
              </div>
            </div>
            <AudioLibraryTab
              audioMedia={filteredAudioMedia}
              searchTerm={audioSearchTerm}
              onSearchChange={setAudioSearchTerm}
              loading={false}
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Explore;
