
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, VolumeX, Volume2, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { africanDialects } from "@/data/culturalData";
import RatingDisplay from "@/components/discovery/RatingDisplay";
import AddToListButton from "@/components/discovery/AddToListButton";

const CulturalDialects: React.FC = () => {
  const [region, setRegion] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [playingDialectId, setPlayingDialectId] = useState<number | null>(null);
  
  const filteredDialects = africanDialects.filter(dialect => {
    const matchesRegion = region === "all" || dialect.region === region;
    const matchesSearch = 
      dialect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dialect.tribe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dialect.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRegion && matchesSearch;
  });

  const regions = Array.from(new Set(africanDialects.map(dialect => dialect.region)));

  const togglePlay = (dialectId: number) => {
    if (playingDialectId === dialectId) {
      setPlayingDialectId(null);
    } else {
      setPlayingDialectId(dialectId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Indigenous African Languages</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search dialects..."
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

      {filteredDialects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No dialects found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDialects.map((dialect) => (
            <Card key={dialect.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{dialect.name}</CardTitle>
                  <Badge variant="secondary">{dialect.region}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>{dialect.tribe}</span>
                </div>
                <RatingDisplay contentId={dialect.id.toString()} contentType="dialect" />
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">
                  {dialect.description}
                </p>
                <div className="bg-muted/30 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Example Phrases:</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => togglePlay(dialect.id)}
                    >
                      {playingDialectId === dialect.id ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {dialect.examplePhrases.map((phrase, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{phrase.native}</span>
                        <span className="text-muted-foreground">{phrase.english}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <AddToListButton contentId={dialect.id.toString()} contentType="dialect" />
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/archive/dialect/${dialect.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Discuss
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

export default CulturalDialects;
