
import React from "react";
import { Label } from "@/components/ui/label";
import VisualBackgroundControls from "@/components/story/VisualBackgroundControls";
import AmbientSoundControls from "@/components/story/AmbientSoundControls";
import useStoryBackground from "@/hooks/useStoryBackground";

interface StoryBackgroundControlsProps {
  storyId: number;
  storyTitle: string;
}

const StoryBackgroundControls: React.FC<StoryBackgroundControlsProps> = ({ storyId, storyTitle }) => {
  const {
    visualBackgroundEnabled,
    ambientSoundEnabled,
    selectedBackground,
    selectedAmbientSound,
    ambientSoundVolume,
    backgroundOpacity,
    toggleVisualBackground,
    toggleAmbientSound,
    changeBackground,
    changeAmbientSound,
  } = useStoryBackground({ storyId, storyTitle });

  return (
    <div className="p-4 space-y-4 bg-muted/20 rounded-md">
      <h3 className="text-lg font-medium">Reading Experience</h3>
      
      <div className="space-y-4">
        <VisualBackgroundControls
          storyId={storyId}
          visualBackgroundEnabled={visualBackgroundEnabled}
          selectedBackground={selectedBackground}
          backgroundOpacity={backgroundOpacity}
          toggleVisualBackground={toggleVisualBackground}
          changeBackground={changeBackground}
        />
        
        <AmbientSoundControls
          storyId={storyId}
          ambientSoundEnabled={ambientSoundEnabled}
          selectedAmbientSound={selectedAmbientSound}
          ambientSoundVolume={ambientSoundVolume}
          toggleAmbientSound={toggleAmbientSound}
          changeAmbientSound={changeAmbientSound}
        />
      </div>
    </div>
  );
};

export default StoryBackgroundControls;
