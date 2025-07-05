
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import EnhancedStoryCard from "./EnhancedStoryCard";

interface StoryListProps {
  searchTerm?: string;
  selectedCategory?: string;
  stories?: Story[];
  activeAudioId?: string | null;
  openSettingsId?: string | null;
  onToggleAudio?: (storyId: string) => void;
  onToggleSettings?: (storyId: string) => void;
}

export const StoryList: React.FC<StoryListProps> = ({
  searchTerm = "",
  selectedCategory = "all",
  stories: providedStories,
  activeAudioId,
  openSettingsId,
  onToggleAudio,
  onToggleSettings
}) => {
  const [localActiveAudioId, setLocalActiveAudioId] = useState<string | null>(null);
  const [localOpenSettingsId, setLocalOpenSettingsId] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  // Use provided handlers or local state
  const handleToggleAudio = onToggleAudio || ((storyId: string) => {
    setLocalActiveAudioId(localActiveAudioId === storyId ? null : storyId);
  });

  const handleToggleSettings = onToggleSettings || ((storyId: string) => {
    setLocalOpenSettingsId(localOpenSettingsId === storyId ? null : storyId);
  });

  const currentActiveAudioId = activeAudioId !== undefined ? activeAudioId : localActiveAudioId;
  const currentOpenSettingsId = openSettingsId !== undefined ? openSettingsId : localOpenSettingsId;

  // Load stories when not provided
  useEffect(() => {
    const loadStories = async () => {
      if (providedStories) {
        setStories(providedStories);
        return;
      }

      setLoading(true);
      try {
        // Get published stories from service
        const publishedStories = await storyService.getPublishedStories();
        
        // Add some sample community stories
        const sampleCommunityStories: Story[] = [
          {
            id: "community-1",
            title: "The Digital Nomad's Journey",
            description: "A modern tale of remote work and global adventures, with interactive audio narration",
            author: "user-creator-1",
            status: "published",
            featured: true,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
            startSceneId: "scene-1",
            coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2835&auto=format&fit=crop",
            scenes: [{
              id: "scene-1",
              title: "The Beginning",
              content: "Sarah packed her laptop and dreams into a single backpack...",
              choices: [],
              isEnding: true,
              audio: "https://example.com/narration1.mp3"
            }]
          },
          {
            id: "community-2", 
            title: "Grandmother's Recipe Collection",
            description: "Heartwarming stories behind traditional family recipes, seeking illustrators for collaboration",
            author: "user-creator-2",
            status: "published",
            featured: false,
            createdAt: "2024-01-16T14:30:00Z",
            updatedAt: "2024-01-16T14:30:00Z",
            startSceneId: "scene-2",
            coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2940&auto=format&fit=crop",
            scenes: [{
              id: "scene-2",
              title: "The Kitchen Chronicles", 
              content: "Every recipe tells a story, every story holds a memory...",
              choices: [],
              isEnding: true
            }]
          },
          {
            id: "community-3",
            title: "Urban Legends Reimagined",
            description: "Classic urban legends retold for the digital age with atmospheric audio",
            author: "user-creator-3", 
            status: "published",
            featured: true,
            createdAt: "2024-01-17T09:15:00Z",
            updatedAt: "2024-01-17T09:15:00Z",
            startSceneId: "scene-3",
            coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2825&auto=format&fit=crop",
            scenes: [{
              id: "scene-3",
              title: "The Midnight Caller",
              content: "In the age of smartphones, some calls still come from unknown numbers...",
              choices: [],
              isEnding: true,
              audio: "https://example.com/narration3.mp3"
            }]
          },
          {
            id: "community-4",
            title: "The Artist's Dilemma",
            description: "A creative story about finding inspiration in unexpected places - open to collaboration!",
            author: "user-creator-4",
            status: "published",
            featured: false,
            createdAt: "2024-01-18T12:00:00Z",
            updatedAt: "2024-01-18T12:00:00Z",
            startSceneId: "scene-4",
            coverImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2858&auto=format&fit=crop",
            scenes: [{
              id: "scene-4",
              title: "Empty Canvas",
              content: "The blank canvas stared back at Maya, challenging her to create something meaningful...",
              choices: [],
              isEnding: true
            }]
          }
        ];

        const allStories = [...publishedStories, ...sampleCommunityStories];
        setStories(allStories);
      } catch (error) {
        console.error("Error loading stories:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [providedStories]);

  // Filter stories based on search and category
  const filteredStories = stories.filter(story => {
    const matchesSearch = !searchTerm || 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      (selectedCategory === "trending" && story.featured) ||
      (selectedCategory === "community" && (story.id.startsWith("community-") || !story.id.startsWith("story-")));
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <p className="text-muted-foreground">Loading stories...</p>
        </motion.div>
      </div>
    );
  }

  if (filteredStories.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <h3 className="text-xl font-semibold mb-2">No stories found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? "Try adjusting your search terms or explore different categories." : "Be the first to share your story with the community!"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <EnhancedStoryCard
            story={story}
            activeAudioId={currentActiveAudioId}
            openSettingsId={currentOpenSettingsId}
            onToggleAudio={handleToggleAudio}
            onToggleSettings={handleToggleSettings}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Also export as default for backward compatibility
export default StoryList;
