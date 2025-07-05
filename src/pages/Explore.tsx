
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoryFilters from "@/components/stories/StoryFilters";
import StoryList from "@/components/stories/StoryList";
import SignUpReminder from "@/components/auth/SignUpReminder";
import { storyService } from "@/services/storyService";
import { mediaService } from "@/services/mediaService";
import { Story } from "@/types/story";
import { CreatorMedia } from "@/services/mediaService";
import { useAuth } from "@/contexts/AuthContext";
import { StoryCardSkeleton } from "@/components/common/LoadingStates";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import AudioLibraryTab from "@/components/explore/AudioLibraryTab";

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);
  const [showSignUpReminder, setShowSignUpReminder] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [audioMedia, setAudioMedia] = useState<CreatorMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stories");
  const { isLoggedIn } = useAuth();

  // Dynamic categories based on actual stories
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load published stories
        const publishedStories = await storyService.getPublishedStories();
        setStories(publishedStories);
        
        // Load public audio media
        const publicAudio = await mediaService.getPublicMedia('audio');
        setAudioMedia(publicAudio);
        
        // Extract unique categories from stories
        const storyCategories = new Set<string>();
        publishedStories.forEach(story => {
          if (story.status) {
            storyCategories.add(story.status);
          }
        });
        
        setCategories(["All", ...Array.from(storyCategories)]);
      } catch (error) {
        console.error("Failed to load content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
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

  const filteredAudio = audioMedia.filter(audio => {
    if (searchTerm && !audio.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !audio.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
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
            <h1 className="text-4xl font-bold mb-4">Explore</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover stories, music, and audio creations from our community of talented creators. 
              Connect, discuss, and explore the rich world of African storytelling and culture.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Connect with Creators</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Join Discussions</span>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:w-auto w-full">
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="audio">Audio Library</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="stories" className="space-y-8">
              <StoryFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </TabsContent>

            <TabsContent value="audio" className="space-y-8">
              <AudioLibraryTab 
                audioMedia={filteredAudio}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
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
