
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Compass, 
  TrendingUp, 
  Map, 
  Star, 
  BookOpen, 
  Globe, 
  Heart,
  ArrowRight,
  Sparkles,
  Users,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

interface CulturalJourney {
  id: string;
  title: string;
  description: string;
  culture: string;
  storyCount: number;
  completedStories: number;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  themes: string[];
  image: string;
  isStarted: boolean;
}

interface RecommendedStory {
  id: string;
  title: string;
  author: string;
  description: string;
  culture: string;
  readTime: string;
  rating: number;
  tags: string[];
  image: string;
  matchReason: string;
  matchScore: number;
}

export const PersonalizedDiscovery: React.FC = () => {
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);

  const culturalJourneys: CulturalJourney[] = [
    {
      id: "1",
      title: "Tales from the Silk Road",
      description: "Journey through ancient trade routes and discover stories that connected East and West",
      culture: "Central Asian",
      storyCount: 12,
      completedStories: 3,
      estimatedTime: "2-3 weeks",
      difficulty: "Intermediate",
      themes: ["Trade", "Adventure", "Cultural Exchange"],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400",
      isStarted: true
    },
    {
      id: "2",
      title: "Voices of the Ancestors",
      description: "Explore Native American oral traditions and their connection to the natural world",
      culture: "Native American",
      storyCount: 8,
      completedStories: 0,
      estimatedTime: "1-2 weeks",
      difficulty: "Beginner",
      themes: ["Nature", "Spirituality", "Wisdom"],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400",
      isStarted: false
    },
    {
      id: "3",
      title: "Modern African Narratives",
      description: "Contemporary stories from across Africa exploring identity, change, and community",
      culture: "African",
      storyCount: 15,
      completedStories: 0,
      estimatedTime: "3-4 weeks",
      difficulty: "Advanced",
      themes: ["Identity", "Community", "Change"],
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=400",
      isStarted: false
    }
  ];

  const recommendedStories: RecommendedStory[] = [
    {
      id: "1",
      title: "The Digital Shaman",
      author: "Maria Santos",
      description: "A young indigenous woman bridges ancient wisdom with modern technology",
      culture: "Indigenous",
      readTime: "15 min",
      rating: 4.8,
      tags: ["Technology", "Tradition", "Identity"],
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=300",
      matchReason: "Based on your interest in cultural fusion stories",
      matchScore: 95
    },
    {
      id: "2",
      title: "Letters from Hanoi",
      author: "Nguyen Linh",
      description: "A family's story told through letters spanning three generations",
      culture: "Vietnamese",
      readTime: "20 min",
      rating: 4.6,
      tags: ["Family", "History", "Letters"],
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=300",
      matchReason: "Similar to stories you've recently saved",
      matchScore: 88
    },
    {
      id: "3",
      title: "The Midnight Market",
      author: "Ahmed Hassan",
      description: "Magical realism meets urban life in contemporary Cairo",
      culture: "Middle Eastern",
      readTime: "12 min",
      rating: 4.7,
      tags: ["Magic", "Urban", "Contemporary"],
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=300",
      matchReason: "Trending in your preferred genres",
      matchScore: 92
    }
  ];

  const trendingStories = [
    {
      id: "1",
      title: "The Last Storyteller",
      author: "Elena Rodriguez",
      culture: "Latin American",
      readers: 2340,
      trend: "+45%"
    },
    {
      id: "2", 
      title: "Neon Dragons",
      author: "Kenji Nakamura",
      culture: "Japanese",
      readers: 1890,
      trend: "+32%"
    },
    {
      id: "3",
      title: "Songs of the Sahara",
      author: "Fatima Al-Rashid",
      culture: "North African",
      readers: 1567,
      trend: "+28%"
    }
  ];

  const crossCulturalConnections = [
    {
      id: "1",
      title: "Water Spirits Across Cultures",
      description: "Explore how different cultures tell stories about water spirits and their meanings",
      cultures: ["Celtic", "Japanese", "Native American", "Slavic"],
      storyCount: 8
    },
    {
      id: "2",
      title: "Coming of Age Rituals",
      description: "Universal themes of growing up told through diverse cultural lenses",
      cultures: ["Australian Aboriginal", "Maasai", "Jewish", "Hindu"],
      storyCount: 12
    },
    {
      id: "3",
      title: "Migration Stories",
      description: "Stories of movement, displacement, and finding new homes",
      cultures: ["Irish", "Chinese", "Syrian", "Mexican"],
      storyCount: 15
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
          Discover Your Next Story
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Personalized recommendations based on your cultural interests and reading history
        </p>
      </div>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommended">
            <Sparkles className="h-4 w-4 mr-2" />
            For You
          </TabsTrigger>
          <TabsTrigger value="journeys">
            <Map className="h-4 w-4 mr-2" />
            Cultural Journeys
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="connections">
            <Globe className="h-4 w-4 mr-2" />
            Cross-Cultural
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-heritage-purple text-white">
                        {story.matchScore}% match
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                        {story.culture}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-heritage-purple transition-colors">
                      {story.title}
                    </CardTitle>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>by {story.author}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{story.rating}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {story.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {story.readTime}
                      </span>
                      <span className="text-heritage-purple font-medium">
                        {story.matchReason}
                      </span>
                    </div>

                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Story
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="journeys" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {culturalJourneys.map((journey, index) => (
              <motion.div
                key={journey.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={journey.image}
                      alt={journey.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-cultural-gold text-white">
                          {journey.culture}
                        </Badge>
                        <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                          {journey.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="group-hover:text-heritage-purple transition-colors">
                      {journey.title}
                    </CardTitle>
                    <p className="text-muted-foreground line-clamp-2">
                      {journey.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {journey.themes.map((theme) => (
                        <Badge key={theme} variant="secondary" className="text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{journey.completedStories}/{journey.storyCount} stories</span>
                      </div>
                      <Progress value={(journey.completedStories / journey.storyCount) * 100} />
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {journey.storyCount} stories
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {journey.estimatedTime}
                      </span>
                    </div>

                    <Button 
                      className="w-full"
                      variant={journey.isStarted ? "outline" : "default"}
                    >
                      {journey.isStarted ? "Continue Journey" : "Start Journey"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Trending Stories</h2>
              <p className="text-muted-foreground">
                Stories gaining popularity in the community this week
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-heritage-purple transition-colors">
                            {story.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">by {story.author}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {story.trend}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{story.culture}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {story.readers} readers
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="connections" className="mt-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Cross-Cultural Connections</h2>
              <p className="text-muted-foreground">
                Discover stories that bridge different cultural traditions and universal themes
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {crossCulturalConnections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardHeader>
                      <CardTitle className="group-hover:text-heritage-purple transition-colors">
                        {connection.title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {connection.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {connection.cultures.map((culture) => (
                          <Badge key={culture} className="bg-cultural-gold/10 text-cultural-gold">
                            {culture}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {connection.storyCount} connected stories
                        </span>
                        <Button variant="outline" size="sm">
                          <Compass className="h-4 w-4 mr-2" />
                          Explore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
