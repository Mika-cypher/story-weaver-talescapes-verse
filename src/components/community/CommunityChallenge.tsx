
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, Users, PenTool, Star, Clock, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

interface Challenge {
  id: string;
  title: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  submissions: number;
  prize: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "upcoming" | "active" | "completed";
  culturalFocus: string;
  requirements: string[];
  judgesCriteria: string[];
  isParticipating: boolean;
}

export const CommunityChallenge: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const challenges: Challenge[] = [
    {
      id: "1",
      title: "Winter Solstice Stories",
      description: "Create stories that capture the magic and traditions of winter celebrations across different cultures.",
      theme: "Seasonal Traditions",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      participants: 156,
      maxParticipants: 200,
      submissions: 89,
      prize: "Featured placement + $500 prize pool",
      difficulty: "Intermediate",
      status: "active",
      culturalFocus: "Global Winter Traditions",
      requirements: [
        "Story must be 1000-3000 words",
        "Include at least one cultural tradition",
        "Original content only",
        "Family-friendly content"
      ],
      judgesCriteria: [
        "Cultural authenticity",
        "Creative storytelling",
        "Emotional impact",
        "Writing quality"
      ],
      isParticipating: true
    },
    {
      id: "2",
      title: "Digital Folklore",
      description: "Reimagine traditional folklore for the digital age. How would classic tales unfold in our connected world?",
      theme: "Modern Mythology",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      participants: 89,
      maxParticipants: 150,
      submissions: 34,
      prize: "Publication opportunity + Mentorship program",
      difficulty: "Advanced",
      status: "upcoming",
      culturalFocus: "Traditional Folklore Adaptation",
      requirements: [
        "Based on existing folklore",
        "Modern setting/context",
        "1500-4000 words",
        "Cite original folklore source"
      ],
      judgesCriteria: [
        "Innovation in adaptation",
        "Respect for source material",
        "Contemporary relevance",
        "Narrative coherence"
      ],
      isParticipating: false
    },
    {
      id: "3",
      title: "Voices of Youth",
      description: "Stories from the perspective of young people navigating cultural identity in a globalized world.",
      theme: "Cultural Identity",
      startDate: "2023-11-01",
      endDate: "2023-11-30",
      participants: 234,
      submissions: 187,
      prize: "Community choice award + Featured collection",
      difficulty: "Beginner",
      status: "completed",
      culturalFocus: "Youth & Identity",
      requirements: [
        "Protagonist aged 13-25",
        "Cultural identity theme",
        "500-2000 words",
        "Personal or fictional narrative"
      ],
      judgesCriteria: [
        "Authentic voice",
        "Cultural insight",
        "Emotional resonance",
        "Accessibility"
      ],
      isParticipating: false
    }
  ];

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "upcoming": return "bg-blue-500";
      case "completed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
          Community Challenges
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join monthly storytelling prompts and cultural celebration events to grow your craft and connect with the community
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {challenges.filter(c => c.status === "active").map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 group-hover:text-heritage-purple transition-colors">
                          {challenge.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(challenge.status)}>
                            {challenge.status}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Trophy className="h-6 w-6 text-cultural-gold" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {challenge.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {getDaysRemaining(challenge.endDate)} days left
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {challenge.participants} participants
                        </span>
                      </div>

                      {challenge.maxParticipants && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Participation</span>
                            <span>{challenge.participants}/{challenge.maxParticipants}</span>
                          </div>
                          <Progress value={(challenge.participants / challenge.maxParticipants) * 100} />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Submissions</span>
                          <span>{challenge.submissions}</span>
                        </div>
                        <Progress value={(challenge.submissions / challenge.participants) * 100} />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground mb-2">
                        <Star className="h-4 w-4 inline mr-1" />
                        Prize: {challenge.prize}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Target className="h-4 w-4 inline mr-1" />
                        Focus: {challenge.culturalFocus}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedChallenge(challenge.id)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant={challenge.isParticipating ? "secondary" : "default"}
                        size="sm"
                        className="flex-1"
                      >
                        {challenge.isParticipating ? "Participating" : "Join Challenge"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {challenges.filter(c => c.status === "upcoming").map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group opacity-90">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 group-hover:text-heritage-purple transition-colors">
                          {challenge.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(challenge.status)}>
                            {challenge.status}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {challenge.description}
                    </p>

                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Starts: {new Date(challenge.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Focus: {challenge.culturalFocus}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Prize: {challenge.prize}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedChallenge(challenge.id)}
                      >
                        Learn More
                      </Button>
                      <Button 
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        Get Notified
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {challenges.filter(c => c.status === "completed").map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 group-hover:text-heritage-purple transition-colors">
                          {challenge.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(challenge.status)}>
                            {challenge.status}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Award className="h-6 w-6 text-cultural-gold" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {challenge.description}
                    </p>

                    <div className="text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Participants:</span>
                        <span className="font-medium">{challenge.participants}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Submissions:</span>
                        <span className="font-medium">{challenge.submissions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Completion Rate:</span>
                        <span className="font-medium">
                          {Math.round((challenge.submissions / challenge.participants) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        View Winners
                      </Button>
                      <Button 
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        Browse Entries
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Challenge Details Modal would go here */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal content would go here */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Challenge Details</h2>
              <Button onClick={() => setSelectedChallenge(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
