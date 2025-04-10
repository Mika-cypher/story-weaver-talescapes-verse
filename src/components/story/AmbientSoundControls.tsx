
import React, { useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import { 
  ambientSoundOptions, 
  getAmbientSoundUrl 
} from "@/utils/storyBackgroundOptions";

interface AmbientSoundControlsProps {
  storyId: number;
  ambientSoundEnabled: boolean;
  selectedAmbientSound: string | null;
  ambientSoundVolume: number;
  toggleAmbientSound: (enabled: boolean) => void;
  changeAmbientSound: (soundId: string) => void;
}

const AmbientSoundControls: React.FC<AmbientSoundControlsProps> = ({
  storyId,
  ambientSoundEnabled,
  selectedAmbientSound,
  ambientSoundVolume,
  toggleAmbientSound,
  changeAmbientSound
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = ambientSoundVolume;
    }
  }, [ambientSoundVolume]);

  useEffect(() => {
    if (ambientSoundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [ambientSoundEnabled]);

  useEffect(() => {
    if (selectedAmbientSound && audioRef.current) {
      audioRef.current.src = getAmbientSoundUrl(selectedAmbientSound);
      if (ambientSoundEnabled) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
    }
  }, [selectedAmbientSound, ambientSoundEnabled]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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

      <audio
        ref={audioRef}
        src={getAmbientSoundUrl(selectedAmbientSound)}
        loop
        preload="auto"
      />
    </div>
  );
};

export default AmbientSoundControls;
