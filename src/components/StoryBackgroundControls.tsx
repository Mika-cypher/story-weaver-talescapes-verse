import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageIcon, Music, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const backgroundOptions = [
  { id: "forest", name: "Forest", url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843" },
  { id: "night", name: "Starry Night", url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb" },
  { id: "mountain", name: "Mountain Fog", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" },
  { id: "river", name: "River", url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb" },
  { id: "sunset", name: "Sunset", url: "https://images.unsplash.com/photo-1500673922987-e212871fec22" },
];

const ambientSoundOptions = [
  { id: "forest", name: "Forest Sounds", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "rain", name: "Rainfall", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "waves", name: "Ocean Waves", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: "fire", name: "Crackling Fire", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

interface StoryBackgroundControlsProps {
  storyId: number;
  storyTitle: string;
}

const StoryBackgroundControls: React.FC<StoryBackgroundControlsProps> = ({ storyId, storyTitle }) => {
  const [visualBackgroundEnabled, setVisualBackgroundEnabled] = useState(false);
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedAmbientSound, setSelectedAmbientSound] = useState<string | null>(null);
  const [ambientSoundVolume, setAmbientSoundVolume] = useState(0.3);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = ambientSoundVolume;
    }
  }, [ambientSoundVolume]);

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
    
    if (enabled && selectedAmbientSound && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    
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
    
    if (ambientSoundEnabled && audioRef.current) {
      audioRef.current.src = getAmbientSoundUrl(soundId);
      audioRef.current.play();
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

  const getBackgroundUrl = (backgroundId: string | null): string => {
    if (!backgroundId) return '';
    const background = backgroundOptions.find(bg => bg.id === backgroundId);
    return background ? background.url : '';
  };

  const getAmbientSoundUrl = (soundId: string | null): string => {
    if (!soundId) return '';
    const sound = ambientSoundOptions.find(s => s.id === soundId);
    return sound ? sound.url : '';
  };

  const getBackgroundName = (backgroundId: string | null): string => {
    if (!backgroundId) return 'None';
    const background = backgroundOptions.find(bg => bg.id === backgroundId);
    return background ? background.name : 'Unknown';
  };

  const getAmbientSoundName = (soundId: string | null): string => {
    if (!soundId) return 'None';
    const sound = ambientSoundOptions.find(s => s.id === soundId);
    return sound ? sound.name : 'Unknown';
  };

  return (
    <div className="p-4 space-y-4 bg-muted/20 rounded-md">
      <h3 className="text-lg font-medium">Reading Experience</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ImageIcon size={16} />
            <Label htmlFor={`visual-bg-${storyId}`}>Visual Background</Label>
          </div>
          <Switch 
            id={`visual-bg-${storyId}`}
            checked={visualBackgroundEnabled}
            onCheckedChange={toggleVisualBackground}
          />
        </div>
        
        <div className={`transition-opacity duration-300 ${visualBackgroundEnabled ? 'opacity-100' : 'opacity-50'}`}>
          <Label htmlFor={`bg-select-${storyId}`} className="mb-1 block">Select Background</Label>
          <Select 
            disabled={!visualBackgroundEnabled} 
            value={selectedBackground || ''}
            onValueChange={changeBackground}
          >
            <SelectTrigger id={`bg-select-${storyId}`}>
              <SelectValue placeholder="Choose a background" />
            </SelectTrigger>
            <SelectContent>
              {backgroundOptions.map(bg => (
                <SelectItem key={bg.id} value={bg.id}>{bg.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Music size={16} />
            <Label htmlFor={`ambient-sound-${storyId}`}>Ambient Sound</Label>
          </div>
          <Switch 
            id={`ambient-sound-${storyId}`}
            checked={ambientSoundEnabled}
            onCheckedChange={toggleAmbientSound}
          />
        </div>
        
        <div className={`transition-opacity duration-300 ${ambientSoundEnabled ? 'opacity-100' : 'opacity-50'}`}>
          <Label htmlFor={`sound-select-${storyId}`} className="mb-1 block">Select Sound</Label>
          <Select 
            disabled={!ambientSoundEnabled} 
            value={selectedAmbientSound || ''} 
            onValueChange={changeAmbientSound}
          >
            <SelectTrigger id={`sound-select-${storyId}`}>
              <SelectValue placeholder="Choose a sound" />
            </SelectTrigger>
            <SelectContent>
              {ambientSoundOptions.map(sound => (
                <SelectItem key={sound.id} value={sound.id}>{sound.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={getAmbientSoundUrl(selectedAmbientSound)}
        loop
        preload="auto"
      />
    </div>
  );
};

export default StoryBackgroundControls;
