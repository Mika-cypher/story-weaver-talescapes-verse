
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatorProfile } from "@/components/community/CreatorProfile";
import { StoryCollections } from "@/components/community/StoryCollections";
import { CommunityChallenge } from "@/components/community/CommunityChallenge";
import { PersonalizedDiscovery } from "@/components/community/PersonalizedDiscovery";
import { MentorshipProgram } from "@/components/community/MentorshipProgram";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Community: React.FC = () => {
  // Sample creator data - in a real app, this would come from props or API
  const sampleCreator = {
    id: "1",
    name: "elena_rodriguez",
    displayName: "Elena Rodriguez",
    bio: "Award-winning storyteller specializing in Latin American folklore and magical realism. I've been sharing stories across cultures for over 15 years, helping preserve and celebrate diverse narrative traditions.",
    culturalBackground: ["Mexican", "Colombian", "Indigenous"],
    storytellingStyle: ["Magical Realism", "Folklore", "Contemporary Fiction", "Oral Tradition"],
    location: "Mexico City, Mexico",
    joinedDate: "March 2020",
    followers: 1247,
    following: 89,
    storiesPublished: 23,
    averageRating: 4.8,
    achievements: [
      "Cultural Heritage Award 2023",
      "Community Choice Winner",
      "Featured Author",
      "Storytelling Master",
      "Mentor of the Year"
    ],
    avatar: "/api/placeholder/100/100",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=1000",
    languages: ["Spanish", "English", "Nahuatl"],
    specialties: ["Magical Realism", "Cultural Authenticity", "Character Development", "Folklore Adaptation"]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Tabs defaultValue="discovery" className="w-full">
          <div className="border-b">
            <div className="container mx-auto px-4">
              <TabsList className="h-12 w-full max-w-4xl mx-auto grid grid-cols-5">
                <TabsTrigger value="discovery">Discovery</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="discovery" className="mt-0">
            <PersonalizedDiscovery />
          </TabsContent>

          <TabsContent value="collections" className="mt-0">
            <StoryCollections />
          </TabsContent>

          <TabsContent value="challenges" className="mt-0">
            <CommunityChallenge />
          </TabsContent>

          <TabsContent value="mentorship" className="mt-0">
            <MentorshipProgram />
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <CreatorProfile creator={sampleCreator} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
