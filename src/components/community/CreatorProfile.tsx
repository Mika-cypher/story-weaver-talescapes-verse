
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Users, Star, BookOpen, Award, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface CreatorProfileProps {
  creator: {
    id: string;
    name: string;
    displayName: string;
    bio: string;
    culturalBackground: string[];
    storytellingStyle: string[];
    location: string;
    joinedDate: string;
    followers: number;
    following: number;
    storiesPublished: number;
    averageRating: number;
    achievements: string[];
    avatar: string;
    coverImage: string;
    languages: string[];
    specialties: string[];
  };
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({ creator }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image & Avatar Section */}
      <div className="relative h-64 bg-gradient-to-r from-heritage-purple to-cultural-gold">
        <img 
          src={creator.coverImage} 
          alt={`${creator.name}'s cover`}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="absolute bottom-4 left-4 flex items-end space-x-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback className="text-2xl">{creator.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="text-white">
            <h1 className="text-3xl font-bold">{creator.displayName}</h1>
            <p className="text-lg opacity-90">@{creator.name}</p>
            <div className="flex items-center mt-2 space-x-4 text-sm">
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{creator.location}</span>
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" />Joined {creator.joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="stories" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stories" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Published Stories</h3>
                  {/* Story cards would go here */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((story) => (
                      <Card key={story} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="line-clamp-2">Sample Story Title {story}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3">
                            A captivating story that explores cultural themes and traditions...
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">4.8</span>
                            </div>
                            <Badge variant="secondary">Folklore</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="collections" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Story Collections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Cultural Bridges', 'Ancient Wisdom', 'Modern Folklore'].map((collection) => (
                      <Card key={collection} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>{collection}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            A curated collection of stories exploring {collection.toLowerCase()}...
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-muted-foreground">12 stories</span>
                            <Button variant="outline" size="sm">View Collection</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {creator.displayName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Bio</h4>
                      <p className="text-muted-foreground">{creator.bio}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Cultural Background</h4>
                      <div className="flex flex-wrap gap-2">
                        {creator.culturalBackground.map((culture) => (
                          <Badge key={culture} className="bg-heritage-purple/10 text-heritage-purple">
                            <Globe className="h-3 w-3 mr-1" />
                            {culture}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Storytelling Style</h4>
                      <div className="flex flex-wrap gap-2">
                        {creator.storytellingStyle.map((style) => (
                          <Badge key={style} variant="outline">{style}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {creator.languages.map((language) => (
                          <Badge key={language} variant="secondary">{language}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: 'Published new story', item: 'The Midnight Garden', time: '2 days ago' },
                        { action: 'Joined community challenge', item: 'Winter Solstice Stories', time: '1 week ago' },
                        { action: 'Created collection', item: 'Urban Legends Reimagined', time: '2 weeks ago' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                          <div className="h-2 w-2 bg-heritage-purple rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.action}</span> "{activity.item}"
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Creator Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-heritage-purple">{creator.storiesPublished}</div>
                    <div className="text-sm text-muted-foreground">Stories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cultural-gold">{creator.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-heritage-purple">{creator.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cultural-gold">{creator.averageRating}</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Follow Creator
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creator.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-cultural-gold" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {creator.specialties.map((specialty) => (
                    <Badge key={specialty} className="bg-cultural-gold/10 text-cultural-gold">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
