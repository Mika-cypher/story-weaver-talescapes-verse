
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getBackgroundUrl, 
  getBackgroundName, 
  getAmbientSoundName 
} from "@/utils/storyBackgroundOptions";

interface UseStoryBackgroundProps {
  storyId: string;
  storyTitle: string;
}

const useStoryBackground = ({ storyId, storyTitle }: UseStoryBackgroundProps) => {
  const [visualBackgroundEnabled, setVisualBackgroundEnabled] = useState(false);
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedAmbientSound, setSelectedAmbientSound] = useState<string | null>(null);
  const [ambientSoundVolume, setAmbientSoundVolume] = useState(0.3);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3);
  const { toast } = useToast();

  const toggleVisualBackground = (enabled: boolean) => {
    setVisualBackgroundEnabled(enabled);
    
    if (enabled && selectedBackground) {
      applyBackground(selectedBackground);
    } else {
      removeBackground();
    }
    
    toast({
      title: enabled ? "Visual background enabled" : "Visual background disabled",
      description: enabled ? `Background set to ${getBackgroundName(selectedBackground)}` : "Default background restored",
      duration: 3000,
    });
  };

  const toggleAmbientSound = (enabled: boolean) => {
    setAmbientSoundEnabled(enabled);
    
    toast({
      title: enabled ? "Ambient sound enabled" : "Ambient sound disabled",
      description: enabled ? `Now playing ${getAmbientSoundName(selectedAmbientSound)}` : "Ambient sound stopped",
      duration: 3000,
    });
  };

  const changeBackground = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    
    if (visualBackgroundEnabled) {
      applyBackground(backgroundId);
      toast({
        title: "Background changed",
        description: `Background set to ${getBackgroundName(backgroundId)}`,
        duration: 3000,
      });
    }
  };

  const changeAmbientSound = (soundId: string) => {
    setSelectedAmbientSound(soundId);
    
    if (ambientSoundEnabled) {
      toast({
        title: "Ambient sound changed",
        description: `Now playing ${getAmbientSoundName(soundId)}`,
        duration: 3000,
      });
    }
  };

  const applyBackground = (backgroundId: string) => {
    const backgroundUrl = getBackgroundUrl(backgroundId);
    const storyContainer = document.getElementById(`story-card-${storyId}`);
    
    if (storyContainer) {
      storyContainer.style.backgroundImage = `url(${backgroundUrl})`;
      storyContainer.style.backgroundSize = 'cover';
      storyContainer.style.backgroundPosition = 'center';
      storyContainer.style.backgroundBlendMode = 'overlay';
      storyContainer.style.backgroundColor = `rgba(0, 0, 0, ${1 - backgroundOpacity})`;
      storyContainer.style.transition = 'background 0.5s ease';
      storyContainer.style.color = 'white';
    }
  };

  const removeBackground = () => {
    const storyContainer = document.getElementById(`story-card-${storyId}`);
    
    if (storyContainer) {
      storyContainer.style.backgroundImage = '';
      storyContainer.style.backgroundColor = '';
      storyContainer.style.color = '';
    }
  };

  return {
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
    setAmbientSoundVolume,
    setBackgroundOpacity
  };
};

export default useStoryBackground;
