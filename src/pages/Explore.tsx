
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoryFilters from "@/components/stories/StoryFilters";
import StoryList from "@/components/stories/StoryList";
import SignUpReminder from "@/components/auth/SignUpReminder";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import { useAuth } from "@/contexts/AuthContext";
import { StoryCardSkeleton } from "@/components/common/LoadingStates";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Explore: React.FC = () => {
  const navigate = useNavigate();
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
        // Load published stories directly without sample data seeding
        const publishedStories = await storyService.getPublishedStories();
        setStories(publishedStories);
        
        // Extract unique categories from stories
        const storyCategories = new Set<string>();
        publishedStories.forEach(story => {
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
          {/* Return Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="hover:bg-accent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </motion.div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[...Array(6)].map((_, index) => (
                <StoryCardSkeleton key={index} />
              ))}
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
