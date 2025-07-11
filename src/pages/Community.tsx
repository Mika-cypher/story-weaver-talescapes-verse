
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryCollections } from "@/components/community/StoryCollections";
import { CommunityChallenge } from "@/components/community/CommunityChallenge";
import { PersonalizedDiscovery } from "@/components/community/PersonalizedDiscovery";
import { MentorshipProgram } from "@/components/community/MentorshipProgram";
import { AfricanCultureHub } from "@/components/community/AfricanCultureHub";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Community: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* African Culture Hero Section */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 py-12">
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

        <Tabs defaultValue="discovery" className="w-full">
          <div className="border-b">
            <div className="container mx-auto px-4">
              <TabsList className="h-12 w-full max-w-4xl mx-auto grid grid-cols-5">
                <TabsTrigger value="discovery">Discovery</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
                <TabsTrigger value="culture">Culture Hub</TabsTrigger>
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

          <TabsContent value="culture" className="mt-0">
            <AfricanCultureHub />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
