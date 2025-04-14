
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoryFilters from "@/components/stories/StoryFilters";
import StoryList from "@/components/stories/StoryList";
import SignUpReminder from "@/components/auth/SignUpReminder";
import { allStories, categories } from "@/data/mockStories";
import { useAuth } from "@/contexts/AuthContext";

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<number | null>(null);
  const [showSignUpReminder, setShowSignUpReminder] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Show sign-up reminder after 20 seconds if not logged in (reduced from 30 seconds)
    if (!isLoggedIn) {
      const timer = setTimeout(() => {
        setShowSignUpReminder(true);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
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

          {filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No stories found matching your criteria.</p>
            </div>
          ) : (
            <StoryList 
              stories={filteredStories}
              activeAudioId={activeAudioId}
              openSettingsId={openSettingsId}
              onToggleAudio={toggleAudio}
              onToggleSettings={toggleSettings}
            />
          )}
        </div>
      </main>
      <Footer />
      
      <SignUpReminder 
        open={showSignUpReminder} 
        onOpenChange={setShowSignUpReminder}
      />
    </div>
  );
};

export default Explore;
