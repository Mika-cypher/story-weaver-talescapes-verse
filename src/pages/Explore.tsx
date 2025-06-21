
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoryFilters from "@/components/stories/StoryFilters";
import StoryList from "@/components/stories/StoryList";
import SignUpReminder from "@/components/auth/SignUpReminder";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);
  const [showSignUpReminder, setShowSignUpReminder] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  // Dynamic categories based on actual stories
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const publishedStories = await storyService.getPublishedStories();
        setStories(publishedStories);
        
        // Extract unique categories from stories (you can expand this logic)
        const storyCategories = new Set<string>();
        publishedStories.forEach(story => {
          // For now, we'll use status as category, but you can add a proper category field
          if (story.status) {
            storyCategories.add(story.status);
          }
        });
        
        setCategories(["All", ...Array.from(storyCategories)]);
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  useEffect(() => {
    // Show sign-up reminder after 30 seconds if not logged in
    if (!isLoggedIn) {
      const timer = setTimeout(() => {
        setShowSignUpReminder(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const filteredStories = stories.filter(story => {
    if (selectedCategory !== "All" && story.status !== selectedCategory) {
      return false;
    }
    
    if (searchTerm && !story.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !story.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const toggleAudio = (storyId: string) => {
    if (activeAudioId === storyId) {
      setActiveAudioId(null);
    } else {
      setActiveAudioId(storyId);
    }
  };

  const toggleSettings = (storyId: string) => {
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

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading stories...</span>
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
