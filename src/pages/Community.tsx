
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageCircle, 
  Star, 
  Trophy, 
  Calendar, 
  BookOpen,
  Heart,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Community: React.FC = () => {
  const featuredCreators = [
    {
      name: "Adaora Okafor",
      username: "@adaora_tales",
      stories: 12,
      followers: 1500,
      region: "West Africa",
      specialty: "Igbo Folktales",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adaora"
    },
    {
      name: "Kofi Asante",
      username: "@kofi_stories",
      stories: 8,
      followers: 890,
      region: "Ghana",
      specialty: "Akan Proverbs",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kofi"
    },
    {
      name: "Amara Diallo",
      username: "@amara_wisdom",
      stories: 15,
      followers: 2100,
      region: "Mali",
      specialty: "Bambara Legends",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amara"
    }
  ];

  const challenges = [
    {
      title: "Ubuntu Stories Challenge",
      description: "Share stories that embody the Ubuntu philosophy",
      participants: 245,
      daysLeft: 12,
      prize: "Featured Story Spotlight"
    },
    {
      title: "Ancestral Wisdom Week",
      description: "Traditional stories passed down through generations",
      participants: 189,
      daysLeft: 5,
      prize: "Community Choice Award"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-heritage-purple/10 to-cultural-gold/10 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 text-heritage-purple">
              African Stories Community 🌍
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with storytellers preserving African heritage through oral traditions, 
              folktales, and contemporary narratives that bridge past and present.
            </p>
          </div>
        </div>

        <Tabs defaultValue="creators" className="w-full">
          <div className="border-b">
            <div className="container mx-auto px-4">
              <TabsList className="h-12 w-full max-w-2xl mx-auto grid grid-cols-3">
                <TabsTrigger value="creators">Featured Creators</TabsTrigger>
                <TabsTrigger value="challenges">Community Challenges</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="creators" className="mt-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCreators.map((creator, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="text-center">
                        <img 
                          src={creator.avatar} 
                          alt={creator.name}
                          className="w-16 h-16 rounded-full mx-auto mb-4"
                        />
                        <CardTitle className="text-lg">{creator.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{creator.username}</p>
                        <Badge variant="secondary" className="w-fit mx-auto">
                          {creator.region}
                        </Badge>
                      </CardHeader>
                      <CardContent className="text-center space-y-3">
                        <p className="text-sm font-medium text-heritage-purple">
                          {creator.specialty}
                        </p>
                        <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {creator.stories} stories
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {creator.followers} followers
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Heart className="h-4 w-4 mr-1" />
                            Follow
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="mt-8">
            <div className="container mx-auto px-4">
              <div className="space-y-6">
                {challenges.map((challenge, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Trophy className="h-5 w-5 mr-2 text-cultural-gold" />
                            {challenge.title}
                          </CardTitle>
                          <p className="text-muted-foreground mt-2">{challenge.description}</p>
                        </div>
                        <Badge variant="secondary">
                          {challenge.daysLeft} days left
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {challenge.participants} participants
                          </span>
                          <span className="flex items-center mt-1">
                            <Star className="h-4 w-4 mr-1" />
                            Prize: {challenge.prize}
                          </span>
                        </div>
                        <Button>
                          Join Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discussions" className="mt-8">
            <div className="container mx-auto px-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Join our discussions about African storytelling, share your experiences, 
                      and connect with fellow creators. Coming soon!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
