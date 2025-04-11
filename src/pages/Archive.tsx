
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CulturalStories from "@/components/archive/CulturalStories";
import CulturalSongs from "@/components/archive/CulturalSongs";
import CulturalDialects from "@/components/archive/CulturalDialects";
import ArchiveHero from "@/components/archive/ArchiveHero";
import ContributeSection from "@/components/archive/ContributeSection";
import ImmersiveExperience from "@/components/archive/ImmersiveExperience";

const Archive: React.FC = () => {
  const [activeTab, setActiveTab] = useState("stories");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <ArchiveHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="stories" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 md:w-auto w-full">
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="songs">Songs</TabsTrigger>
                <TabsTrigger value="dialects">Dialects</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="stories" className="mt-6">
              <CulturalStories />
            </TabsContent>
            
            <TabsContent value="songs" className="mt-6">
              <CulturalSongs />
            </TabsContent>
            
            <TabsContent value="dialects" className="mt-6">
              <CulturalDialects />
            </TabsContent>
          </Tabs>
        </div>

        <ImmersiveExperience />
        <ContributeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Archive;
