
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoryFilters from "@/components/stories/StoryFilters";
import StoryList from "@/components/stories/StoryList";
import { allStories, categories } from "@/data/mockStories";

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<number | null>(null);

  const filteredStories = allStories.filter(story => {
    if (selectedCategory !== "All" && story.category !== selectedCategory) {
      return false;
    }
    
    if (searchTerm && !story.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !story.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const toggleAudio = (storyId: number) => {
    if (activeAudioId === storyId) {
      setActiveAudioId(null);
    } else {
      setActiveAudioId(storyId);
    }
  };

  const toggleSettings = (storyId: number) => {
    if (openSettingsId === storyId) {
      setOpenSettingsId(null);
    } else {
      setOpenSettingsId(storyId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Explore Stories</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover immersive stories created by our community of storytellers.
            </p>
          </div>

          <StoryFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <StoryList 
            stories={filteredStories}
            activeAudioId={activeAudioId}
            openSettingsId={openSettingsId}
            onToggleAudio={toggleAudio}
            onToggleSettings={toggleSettings}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
