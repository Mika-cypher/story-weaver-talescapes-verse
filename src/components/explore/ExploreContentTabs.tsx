
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe, Users } from "lucide-react";
import { StoryList } from "@/components/stories/StoryList";
import AudioLibraryTab from "@/components/explore/AudioLibraryTab";
import { CreatorMedia } from "@/services/mediaService";

interface ExploreContentTabsProps {
  searchTerm: string;
  selectedCategory: string;
  audioSearchTerm: string;
  onAudioSearchChange: (term: string) => void;
  filteredAudioMedia: CreatorMedia[];
}

const ExploreContentTabs = ({ 
  searchTerm, 
  selectedCategory, 
  audioSearchTerm, 
  onAudioSearchChange,
  filteredAudioMedia 
}: ExploreContentTabsProps) => {
  return (
    <Tabs defaultValue="stories" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="stories" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Stories
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audio Library
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="stories" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Community Stories
            </Badge>
            <span className="text-sm text-muted-foreground">
              Discover what others are creating
            </span>
          </div>
        </div>
        <StoryList searchTerm={searchTerm} selectedCategory={selectedCategory} />
      </TabsContent>

      <TabsContent value="audio" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Audio Community
            </Badge>
            <span className="text-sm text-muted-foreground">
              Listen to narrations and soundscapes
            </span>
          </div>
        </div>
        <AudioLibraryTab
          audioMedia={filteredAudioMedia}
          searchTerm={audioSearchTerm}
          onSearchChange={onAudioSearchChange}
          loading={false}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ExploreContentTabs;
