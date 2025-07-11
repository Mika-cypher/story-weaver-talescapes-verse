
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ExploreHero from "@/components/explore/ExploreHero";
import ExploreCategoryFilter from "@/components/explore/ExploreCategoryFilter";
import ExploreContentTabs from "@/components/explore/ExploreContentTabs";
import { sampleAudioMedia } from "@/data/sampleAudioMedia";

const Explore = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [audioSearchTerm, setAudioSearchTerm] = useState("");

  const filteredAudioMedia = sampleAudioMedia.filter(media => {
    const matchesSearch = !audioSearchTerm || 
      media.title.toLowerCase().includes(audioSearchTerm.toLowerCase()) ||
      media.description?.toLowerCase().includes(audioSearchTerm.toLowerCase()) ||
      media.tags?.some(tag => tag.toLowerCase().includes(audioSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Return Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <ExploreHero 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <ExploreCategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ExploreContentTabs 
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          audioSearchTerm={audioSearchTerm}
          onAudioSearchChange={setAudioSearchTerm}
          filteredAudioMedia={filteredAudioMedia}
        />
      </section>
    </div>
  );
};

export default Explore;
