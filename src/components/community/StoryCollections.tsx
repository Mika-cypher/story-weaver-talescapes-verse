
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen, Users, Heart, Star, Plus, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Collection {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorAvatar: string;
  storyCount: number;
  followers: number;
  likes: number;
  coverImage: string;
  tags: string[];
  cultural_theme: string;
  created_at: string;
  isFollowing: boolean;
}

export const StoryCollections: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const collections: Collection[] = [
    {
      id: "1",
      title: "Voices of the Ancestors",
      description: "Traditional stories passed down through generations, preserving ancient wisdom and cultural values.",
      creator: "Elena Rodriguez",
      creatorAvatar: "/api/placeholder/40/40",
      storyCount: 15,
      followers: 1200,
      likes: 890,
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400",
      tags: ["Traditional", "Folklore", "Wisdom"],
      cultural_theme: "Latin American",
      created_at: "2024-01-15",
      isFollowing: false
    },
    {
      id: "2", 
      title: "Modern Myths",
      description: "Contemporary stories that explore timeless themes through a modern lens, bridging past and present.",
      creator: "James Chen",
      creatorAvatar: "/api/placeholder/40/40",
      storyCount: 22,
      followers: 850,
      likes: 1100,
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
      tags: ["Contemporary", "Urban", "Mythology"],
      cultural_theme: "Asian",
      created_at: "2024-01-20",
      isFollowing: true
    },
    {
      id: "3",
      title: "Bridges Between Worlds",
      description: "Stories that connect different cultures, showing universal human experiences across traditions.",
      creator: "Amara Okafor",
      creatorAvatar: "/api/placeholder/40/40",
      storyCount: 18,
      followers: 950,
      likes: 750,
      coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400",
      tags: ["Cross-Cultural", "Unity", "Diversity"],
      cultural_theme: "Multi-Cultural",
      created_at: "2024-01-25",
      isFollowing: false
    }
  ];

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || 
                         collection.cultural_theme.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
          Story Collections
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover curated collections of stories organized by theme, culture, and collaborative efforts
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            onClick={() => setSelectedFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={selectedFilter === "latin" ? "default" : "outline"}
            onClick={() => setSelectedFilter("latin")}
            size="sm"
          >
            Latin American
          </Button>
          <Button
            variant={selectedFilter === "asian" ? "default" : "outline"}
            onClick={() => setSelectedFilter("asian")}
            size="sm"
          >
            Asian
          </Button>
          <Button
            variant={selectedFilter === "multi" ? "default" : "outline"}
            onClick={() => setSelectedFilter("multi")}
            size="sm"
          >
            Multi-Cultural
          </Button>
        </div>
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="newest">Newest</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={collection.coverImage}
                      alt={collection.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-heritage-purple text-white mb-2">
                        {collection.cultural_theme}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-heritage-purple transition-colors">
                      {collection.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <img
                        src={collection.creatorAvatar}
                        alt={collection.creator}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>by {collection.creator}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {collection.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {collection.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {collection.storyCount}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {collection.followers}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {collection.likes}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {/* Handle view collection */}}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant={collection.isFollowing ? "secondary" : "default"}
                        size="sm"
                        onClick={() => {/* Handle follow/unfollow */}}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {collection.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trending" className="mt-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Trending Collections</h3>
            <p className="text-muted-foreground">
              Collections that are gaining popularity in the community
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="newest" className="mt-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Newest Collections</h3>
            <p className="text-muted-foreground">
              Recently created collections from our community
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="following" className="mt-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Collections You Follow</h3>
            <p className="text-muted-foreground">
              Stay updated with your favorite collections
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
