
import React from "react";
import StoryCard, { Story } from "./StoryCard";

interface StoryListProps {
  stories: Story[];
  activeAudioId: number | null;
  openSettingsId: number | null;
  onToggleAudio: (storyId: number) => void;
  onToggleSettings: (storyId: number) => void;
}

const StoryList: React.FC<StoryListProps> = ({
  stories,
  activeAudioId,
  openSettingsId,
  onToggleAudio,
  onToggleSettings
}) => {
  if (stories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No stories found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          activeAudioId={activeAudioId}
          openSettingsId={openSettingsId}
          onToggleAudio={onToggleAudio}
          onToggleSettings={onToggleSettings}
        />
      ))}
    </div>
  );
};

export default StoryList;
