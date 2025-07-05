
import React, { useState } from "react";
import { motion } from "framer-motion";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import EnhancedStoryCard from "./EnhancedStoryCard";

interface StoryListProps {
  searchTerm?: string;
  selectedCategory?: string;
}

export const StoryList: React.FC<StoryListProps> = ({
  searchTerm = "",
  selectedCategory = "all"
}) => {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);

  // Get published stories
  const stories = storyService.getPublishedStories();

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
    }
  ];

  const allStories = [...stories, ...sampleCommunityStories];

  // Filter stories based on search and category
  const filteredStories = allStories.filter(story => {
    const matchesSearch = !searchTerm || 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      (selectedCategory === "trending" && story.featured) ||
      (selectedCategory === "community" && sampleCommunityStories.some(s => s.id === story.id));
    
    return matchesSearch && matchesCategory;
  });

  const handleToggleAudio = (storyId: string) => {
    setActiveAudioId(activeAudioId === storyId ? null : storyId);
  };

  const handleToggleSettings = (storyId: string) => {
    setOpenSettingsId(openSettingsId === storyId ? null : storyId);
  };

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
            activeAudioId={activeAudioId}
            openSettingsId={openSettingsId}
            onToggleAudio={handleToggleAudio}
            onToggleSettings={handleToggleSettings}
          />
        </motion.div>
      ))}
    </div>
  );
};
