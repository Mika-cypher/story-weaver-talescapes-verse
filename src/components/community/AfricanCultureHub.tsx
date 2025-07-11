
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, BookOpen, Music, Globe2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const africanCreators = [
  {
    id: "1",
    name: "Amara Okafor",
    username: "amara_stories",
    region: "West Africa",
    country: "Nigeria",
    specialty: "Yoruba Folktales",
    followers: 2340,
    stories: 45,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=150&h=150&fit=crop&crop=face",
    recentStory: "Anansi and the Wisdom Pot"
  },
  {
    id: "2", 
    name: "Kwame Asante",
    username: "kwame_tales",
    region: "West Africa",
    country: "Ghana",
    specialty: "Ashanti Legends",
    followers: 1876,
    stories: 32,
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    recentStory: "The Golden Stool Legend"
  },
  {
    id: "3",
    name: "Zara Mwangi",
    username: "zara_kenya",
    region: "East Africa", 
    country: "Kenya",
    specialty: "Swahili Stories",
    followers: 3102,
    stories: 56,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=150&h=150&fit=crop&crop=face",
    recentStory: "The Lion and the Hare"
  },
  {
    id: "4",
    name: "Thabo Ndlovu",
    username: "thabo_ubuntu",
    region: "Southern Africa",
    country: "South Africa", 
    specialty: "Ubuntu Philosophy",
    followers: 1654,
    stories: 28,
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    recentStory: "The Village That Shared"
  }
];

const culturalCategories = [
  {
    name: "Oral Traditions",
    description: "Stories passed down through generations",
    icon: "🗣️",
    color: "from-orange-500 to-red-500",
    count: 234
  },
  {
    name: "Ancestral Wisdom", 
    description: "Ancient knowledge and teachings",
    icon: "👴🏾",
    color: "from-purple-500 to-pink-500",
    count: 156
  },
  {
    name: "Creation Myths",
    description: "Stories of origins and beginnings", 
    icon: "🌟",
    color: "from-blue-500 to-teal-500",
    count: 89
  },
  {
    name: "Animal Fables",
    description: "Lessons through animal characters",
    icon: "🦁",
    color: "from-green-500 to-emerald-500", 
    count: 267
  },
  {
    name: "Heroic Legends",
    description: "Tales of courage and triumph",
    icon: "⚔️",
    color: "from-yellow-500 to-orange-500",
    count: 123
  },
  {
    name: "Spiritual Stories",
    description: "Connection to the divine",
    icon: "🕯️",
    color: "from-indigo-500 to-purple-500",
    count: 178
  }
];

export const AfricanCultureHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Cultural Categories Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-heritage-purple">
            Explore African Storytelling Traditions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{category.icon}</div>
                      <div>
                        <h3 className="font-semibold group-hover:text-heritage-purple transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{category.count} stories</Badge>
                      <Button variant="ghost" size="sm">
                        Explore →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured African Storytellers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-heritage-purple">
            Featured African Storytellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {africanCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16 mb-4">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-semibold mb-1 group-hover:text-heritage-purple transition-colors">
                        {creator.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">@{creator.username}</p>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {creator.country}
                      </div>
                      
                      <Badge variant="outline" className="mb-3">
                        {creator.specialty}
                      </Badge>
                      
                      <div className="flex items-center justify-between w-full text-xs text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {creator.followers}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {creator.stories}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {creator.rating}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3">
                        Latest: "{creator.recentStory}"
                      </p>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        asChild
                      >
                        <Link to={`/profile/${creator.username}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cultural Regions Map */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-heritage-purple">
            Stories Across Africa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { region: "West Africa", countries: ["Nigeria", "Ghana", "Senegal", "Mali"], stories: 456, color: "bg-orange-500" },
              { region: "East Africa", countries: ["Kenya", "Ethiopia", "Tanzania", "Uganda"], stories: 234, color: "bg-green-500" },
              { region: "Central Africa", countries: ["Cameroon", "DRC", "Chad", "CAR"], stories: 178, color: "bg-blue-500" },
              { region: "Southern Africa", countries: ["South Africa", "Zimbabwe", "Botswana", "Zambia"], stories: 267, color: "bg-purple-500" }
            ].map((region, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${region.color} mr-3`} />
                    {region.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {region.countries.map((country) => (
                      <p key={country} className="text-sm text-muted-foreground">
                        {country}
                      </p>
                    ))}
                    <div className="pt-2 border-t">
                      <Badge variant="secondary">{region.stories} stories</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
