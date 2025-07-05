import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Search, Music, Volume2, Mic, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface AudioItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  audioUrl: string;
  tags: string[];
}

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);

  // Sample audio library data - this would come from your backend
  useEffect(() => {
    const sampleAudioItems: AudioItem[] = [
      {
        id: "1",
        title: "African Drums Ensemble",
        category: "Traditional Music",
        duration: "3:45",
        description: "Traditional West African drumming patterns and rhythms",
        audioUrl: "/audio/african-drums.mp3",
        tags: ["drums", "traditional", "west-africa", "percussion"]
      },
      {
        id: "2",
        title: "Savanna Winds",
        category: "Nature Sounds",
        duration: "8:20",
        description: "Gentle winds across the African savanna with distant wildlife",
        audioUrl: "/audio/savanna-winds.mp3",
        tags: ["nature", "ambient", "wind", "wildlife"]
      },
      {
        id: "3",
        title: "Storyteller's Voice",
        category: "Voice Narration",
        duration: "2:15",
        description: "Traditional African storytelling voice patterns and intonation",
        audioUrl: "/audio/storyteller.mp3",
        tags: ["voice", "narration", "traditional", "storytelling"]
      },
      {
        id: "4",
        title: "Kora Melodies",
        category: "Traditional Music",
        duration: "5:30",
        description: "Beautiful melodies played on the traditional West African kora",
        audioUrl: "/audio/kora-melodies.mp3",
        tags: ["kora", "traditional", "melody", "west-africa"]
      },
      {
        id: "5",
        title: "Village Evening",
        category: "Nature Sounds",
        duration: "10:00",
        description: "Evening sounds from an African village - crickets, distant voices, fire crackling",
        audioUrl: "/audio/village-evening.mp3",
        tags: ["village", "evening", "ambient", "community"]
      },
      {
        id: "6",
        title: "Griot Chant",
        category: "Voice Narration",
        duration: "4:12",
        description: "Traditional griot chanting style with cultural storytelling elements",
        audioUrl: "/audio/griot-chant.mp3",
        tags: ["griot", "chant", "traditional", "cultural"]
      }
    ];
    setAudioItems(sampleAudioItems);
  }, []);

  const filteredItems = audioItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryItems = (category: string) => 
    filteredItems.filter(item => item.category === category);

  const toggleAudio = (audioId: string) => {
    if (activeAudio === audioId) {
      setActiveAudio(null);
    } else {
      setActiveAudio(audioId);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Traditional Music":
        return <Music className="h-5 w-5" />;
      case "Nature Sounds":
        return <Volume2 className="h-5 w-5" />;
      case "Voice Narration":
        return <Mic className="h-5 w-5" />;
      default:
        return <Music className="h-5 w-5" />;
    }
  };

  const AudioCard = ({ item, index }: { item: AudioItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                {getCategoryIcon(item.category)}
                <span className="text-sm text-muted-foreground">{item.category}</span>
                <Badge variant="secondary" className="text-xs">
                  {item.duration}
                </Badge>
              </div>
            </div>
            <Button
              size="icon"
              variant={activeAudio === item.id ? "default" : "outline"}
              onClick={() => toggleAudio(item.id)}
              className="ml-4"
            >
              {activeAudio === item.id ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {activeAudio === item.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <audio
                controls
                autoPlay
                className="w-full"
                onEnded={() => setActiveAudio(null)}
              >
                <source src={item.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container py-8">
      {/* Return Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="hover:bg-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Audio Library</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of traditional African music, nature sounds, and voice narrations 
          to enhance your storytelling experience.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audio by title, tags, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="all">All Audio</TabsTrigger>
            <TabsTrigger value="traditional">Traditional Music</TabsTrigger>
            <TabsTrigger value="nature">Nature Sounds</TabsTrigger>
            <TabsTrigger value="voice">Voice Narration</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <AudioCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="traditional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCategoryItems("Traditional Music").map((item, index) => (
                <AudioCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nature" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCategoryItems("Nature Sounds").map((item, index) => (
                <AudioCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCategoryItems("Voice Narration").map((item, index) => (
                <AudioCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <h3 className="text-xl font-semibold mb-2">No audio found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or browse different categories.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Library;