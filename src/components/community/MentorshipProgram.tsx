import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Users, 
  Star, 
  MessageCircle, 
  Calendar, 
  Clock,
  Award,
  BookOpen,
  Heart,
  CheckCircle,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

interface Mentor {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  bio: string;
  specialties: string[];
  culturalBackground: string[];
  experience: string;
  menteeCount: number;
  rating: number;
  responseTime: string;
  availableSlots: number;
  languages: string[];
  achievements: string[];
  isAvailable: boolean;
}

interface MentorshipRequest {
  id: string;
  mentorName: string;
  mentorAvatar: string;
  requestDate: string;
  status: "pending" | "accepted" | "declined";
  sessionType: string;
  message: string;
}

export const MentorshipProgram: React.FC = () => {
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("find-mentor");
  const { isLoggedIn } = useAuth();

  const mentors: Mentor[] = [
    {
      id: "1",
      name: "elena_rodriguez",
      displayName: "Elena Rodriguez",
      avatar: "/api/placeholder/80/80",
      bio: "Award-winning storyteller specializing in Latin American folklore and magical realism. I've been sharing stories for over 15 years and love helping new voices find their unique style.",
      specialties: ["Magical Realism", "Folklore", "Character Development", "Cultural Authenticity"],
      culturalBackground: ["Mexican", "Colombian"],
      experience: "15+ years",
      menteeCount: 23,
      rating: 4.9,
      responseTime: "< 24 hours",
      availableSlots: 3,
      languages: ["Spanish", "English"],
      achievements: ["Cultural Heritage Award", "Best Mentor 2023", "Featured Author"],
      isAvailable: true
    },
    {
      id: "2",
      name: "james_chen",
      displayName: "James Chen",
      avatar: "/api/placeholder/80/80",
      bio: "Contemporary fiction writer with expertise in cross-cultural narratives. I help writers explore identity, belonging, and the immigrant experience through storytelling.",
      specialties: ["Contemporary Fiction", "Identity Themes", "Cross-Cultural Stories", "Dialogue Writing"],
      culturalBackground: ["Chinese-American"],
      experience: "12+ years",
      menteeCount: 18,
      rating: 4.8,
      responseTime: "< 12 hours",
      availableSlots: 2,
      languages: ["English", "Mandarin"],
      achievements: ["Emerging Voices Award", "Community Choice Winner"],
      isAvailable: true
    },
    {
      id: "3",
      name: "amara_okafor",
      displayName: "Amara Okafor",
      avatar: "/api/placeholder/80/80",
      bio: "Poet and oral tradition keeper focusing on African storytelling techniques. I specialize in helping writers find their authentic voice and connect with their cultural roots.",
      specialties: ["Oral Tradition", "Poetry", "Voice Development", "Cultural Research"],
      culturalBackground: ["Nigerian", "Igbo"],
      experience: "10+ years",
      menteeCount: 15,
      rating: 4.9,
      responseTime: "< 6 hours",
      availableSlots: 1,
      languages: ["English", "Igbo"],
      achievements: ["Oral Tradition Master", "Cultural Ambassador"],
      isAvailable: false
    }
  ];

  const mentorshipRequests: MentorshipRequest[] = [
    {
      id: "1",
      mentorName: "Elena Rodriguez",
      mentorAvatar: "/api/placeholder/40/40",
      requestDate: "2024-01-15",
      status: "accepted",
      sessionType: "Story Review",
      message: "I'd love feedback on my magical realism short story about family traditions."
    },
    {
      id: "2",
      mentorName: "James Chen",
      mentorAvatar: "/api/placeholder/40/40",
      requestDate: "2024-01-20",
      status: "pending",
      sessionType: "Career Guidance",
      message: "Seeking advice on developing my writing career and finding my unique voice."
    }
  ];

  const mentorshipBenefits = [
    {
      title: "Personalized Feedback",
      description: "Get detailed, constructive feedback on your stories from experienced writers",
      icon: MessageCircle
    },
    {
      title: "Cultural Guidance",
      description: "Learn to authentically represent cultures and traditions in your storytelling",
      icon: GraduationCap
    },
    {
      title: "Career Development",
      description: "Receive guidance on building your writing career and finding opportunities",
      icon: Award
    },
    {
      title: "Community Connection",
      description: "Connect with fellow writers and become part of the storytelling community",
      icon: Users
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-heritage-purple to-cultural-gold bg-clip-text text-transparent">
          Mentorship Program
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with experienced storytellers to grow your craft and cultural storytelling skills
        </p>
        {!isLoggedIn && (
          <div className="mt-6">
            <AuthPrompt
              feature="Mentorship Program"
              description="Connect with experienced mentors to develop your storytelling skills and cultural authenticity."
              benefits={[
                "Get personalized feedback from expert mentors",
                "Learn cultural storytelling techniques",
                "Build your writing career with guidance",
                "Join a supportive community of writers"
              ]}
              variant="inline"
            />
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {mentorshipBenefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <benefit.icon className="h-12 w-12 mx-auto mb-4 text-heritage-purple" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="find-mentor">Find a Mentor</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="become-mentor">Become a Mentor</TabsTrigger>
        </TabsList>

        <TabsContent value="find-mentor" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={mentor.avatar} alt={mentor.displayName} />
                        <AvatarFallback>{mentor.displayName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="group-hover:text-heritage-purple transition-colors">
                          {mentor.displayName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">@{mentor.name}</p>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({mentor.menteeCount} mentees)
                          </span>
                        </div>
                      </div>
                      {mentor.isAvailable ? (
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      ) : (
                        <Badge variant="secondary">Busy</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {mentor.bio}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {mentor.specialties.slice(0, 3).map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {mentor.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{mentor.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Cultural Background</h4>
                        <div className="flex flex-wrap gap-1">
                          {mentor.culturalBackground.map((culture) => (
                            <Badge key={culture} className="bg-cultural-gold/10 text-cultural-gold text-xs">
                              {culture}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Experience:</span>
                          <div className="font-medium">{mentor.experience}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Response time:</span>
                          <div className="font-medium">{mentor.responseTime}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {mentor.availableSlots} slots available
                        </span>
                        <div className="flex gap-2">
                          {mentor.languages.map((lang) => (
                            <Badge key={lang} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedMentor(mentor.id)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={!mentor.isAvailable || !isLoggedIn}
                      >
                        Request Mentorship
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {!isLoggedIn && (
                  <AuthPrompt
                    feature="Mentorship Requests"
                    description="Sign up to connect with mentors and get personalized guidance."
                    variant="overlay"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-requests" className="mt-8">
          {!isLoggedIn ? (
            <AuthPrompt
              feature="Mentorship Requests"
              description="Track your mentorship requests and manage your learning journey."
              benefits={[
                "Track all your mentorship applications",
                "Schedule sessions with accepted mentors",
                "View feedback and progress reports",
                "Access exclusive mentorship resources"
              ]}
            />
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Your Mentorship Requests</h2>
                <p className="text-muted-foreground">
                  Track your mentorship requests and upcoming sessions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentorshipRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={request.mentorAvatar} alt={request.mentorName} />
                              <AvatarFallback>{request.mentorName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{request.mentorName}</CardTitle>
                              <p className="text-sm text-muted-foreground">{request.sessionType}</p>
                            </div>
                          </div>
                          <Badge 
                            className={
                              request.status === "accepted" 
                                ? "bg-green-100 text-green-800"
                                : request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Your Message</h4>
                          <p className="text-muted-foreground text-sm">
                            {request.message}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Requested: {new Date(request.requestDate).toLocaleDateString()}
                          </span>
                          {request.status === "accepted" && (
                            <Button size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Session
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="become-mentor" className="mt-8">
          <div className="max-w-3xl mx-auto">
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Become a Mentor</CardTitle>
                <p className="text-muted-foreground">
                  Share your storytelling expertise and help nurture the next generation of writers
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Requirements</h3>
                    <div className="space-y-2">
                      {[
                        "2+ years of storytelling experience",
                        "Published or recognized work",
                        "Strong communication skills",
                        "Commitment to mentoring"
                      ].map((requirement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Benefits</h3>
                    <div className="space-y-2">
                      {[
                        "Share your expertise",
                        "Build your reputation",
                        "Connect with new writers",
                        "Earn mentorship badges"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-heritage-purple" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center pt-6 border-t">
                  <Button size="lg" className="px-8" disabled={!isLoggedIn}>
                    <User className="h-4 w-4 mr-2" />
                    Apply to Become a Mentor
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Application review typically takes 3-5 business days
                  </p>
                </div>
              </CardContent>

              {!isLoggedIn && (
                <AuthPrompt
                  feature="Mentor Application"
                  description="Join our community of mentors and help shape the next generation of storytellers."
                  variant="overlay"
                />
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
