
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Headphones, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { africanStories } from "@/data/culturalData";

const CulturalStories: React.FC = () => {
  const [region, setRegion] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const filteredStories = africanStories.filter(story => {
    const matchesRegion = region === "all" || story.region === region;
    const matchesSearch = 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.tribe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRegion && matchesSearch;
  });

  const regions = Array.from(new Set(africanStories.map(story => story.region)));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">African Stories & Tales</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stories found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="overflow-hidden h-full flex flex-col">
              <div className="aspect-video relative">
                <img 
                  src={story.imageUrl} 
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {story.region}
                  </Badge>
                  {story.hasAudio && (
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      <Headphones className="h-3 w-3 mr-1" />
                      Audio
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{story.title}</CardTitle>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>{story.tribe}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">
                  {story.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center text-muted-foreground">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{story.likes}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/archive/story/${story.id}`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Story
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CulturalStories;
