
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen, Users, Heart, Star, Plus, Eye, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
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
  const { isLoggedIn } = useAuth();

  const collections: Collection[] = [];

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
          {filteredCollections.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-heritage-purple/10 to-cultural-gold/10 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-heritage-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Create the First Collection</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Help us start building a rich library of African story collections. Curate themes, preserve traditions, and share cultural heritage.
              </p>
              <Button size="lg" asChild>
                <Link to={isLoggedIn ? "/create" : "/signup"}>
                  <Plus className="h-5 w-5 mr-2" />
                  Start a Collection
                </Link>
              </Button>
            </div>
          ) : (
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
          )}
        </TabsContent>
        
        <TabsContent value="trending" className="mt-8">
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-heritage-purple/10 to-cultural-gold/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Star className="h-12 w-12 text-heritage-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Trending Collections Yet</h3>
            <p className="text-muted-foreground">
              Be among the first to create collections that the community will love and share.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="newest" className="mt-8">
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-heritage-purple/10 to-cultural-gold/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-heritage-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Collections Yet</h3>
            <p className="text-muted-foreground">
              Start building our community library by creating the first collection of African stories.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="following" className="mt-8">
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-heritage-purple/10 to-cultural-gold/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-heritage-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Followed Collections</h3>
            <p className="text-muted-foreground">
              Discover and follow collections that inspire you to stay updated with new stories.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
