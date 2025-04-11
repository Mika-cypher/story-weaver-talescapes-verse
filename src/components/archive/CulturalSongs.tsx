
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Play, Pause, Info, Heart } from "lucide-react";
import { africanSongs } from "@/data/culturalData";

const CulturalSongs: React.FC = () => {
  const [region, setRegion] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  
  const filteredSongs = africanSongs.filter(song => {
    const matchesRegion = region === "all" || song.region === region;
    const matchesSearch = 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.tribe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRegion && matchesSearch;
  });

  const regions = Array.from(new Set(africanSongs.map(song => song.region)));

  const togglePlay = (songId: number) => {
    if (playingSongId === songId) {
      setPlayingSongId(null);
    } else {
      setPlayingSongId(songId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Traditional African Music</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search songs..."
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

      {filteredSongs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No songs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <Card key={song.id} className="overflow-hidden h-full flex flex-col">
              <div className="aspect-video relative">
                <img 
                  src={song.imageUrl} 
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-3 right-3 rounded-full shadow-md bg-background/90 backdrop-blur-sm"
                  onClick={() => togglePlay(song.id)}
                >
                  {playingSongId === song.id ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {song.region}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{song.title}</CardTitle>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Music className="h-3 w-3 mr-1" />
                  <span>{song.tribe}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">
                  {song.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center text-muted-foreground">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{song.likes}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  More Info
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CulturalSongs;
