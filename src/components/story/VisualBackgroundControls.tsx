
import React from "react";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { 
  backgroundOptions, 
  getBackgroundName, 
  getBackgroundUrl 
} from "@/utils/storyBackgroundOptions";

interface VisualBackgroundControlsProps {
  storyId: string;
  visualBackgroundEnabled: boolean;
  selectedBackground: string | null;
  backgroundOpacity: number;
  toggleVisualBackground: (enabled: boolean) => void;
  changeBackground: (backgroundId: string) => void;
}

const VisualBackgroundControls: React.FC<VisualBackgroundControlsProps> = ({
  storyId,
  visualBackgroundEnabled,
  selectedBackground,
  toggleVisualBackground,
  changeBackground
}) => {
  return (
    <div className="space-y-4" aria-label="Visual Background Controls">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon size={16} aria-hidden="true" />
          <Label htmlFor={`visual-bg-${storyId}`} className="sr-only">Visual Background Toggle</Label>
          <span className="font-medium">Visual Background</span>
        </div>
        <Switch 
          id={`visual-bg-${storyId}`}
          checked={visualBackgroundEnabled}
          onCheckedChange={toggleVisualBackground}
          aria-checked={visualBackgroundEnabled}
          aria-label="Toggle visual background"
        />
      </div>
      
      <div 
        className={`transition-opacity duration-300 ${visualBackgroundEnabled ? 'opacity-100' : 'opacity-50'}`}
        aria-disabled={!visualBackgroundEnabled} 
      >
        <Label htmlFor={`bg-select-${storyId}`} className="mb-1 block">Select Background</Label>
        <Select 
          disabled={!visualBackgroundEnabled} 
          value={selectedBackground || ''}
          onValueChange={changeBackground}
          aria-label="Select story background"
        >
          <SelectTrigger id={`bg-select-${storyId}`}>
            <SelectValue placeholder="Choose a background" />
          </SelectTrigger>
          <SelectContent>
            {backgroundOptions.map(bg => (
              <SelectItem 
                key={bg.id} 
                value={bg.id}
                aria-label={bg.name}
              >
                <span className="flex items-center gap-2">
                  <span className="inline-block w-5 h-5 rounded-full border border-border" style={{ backgroundImage: `url(${bg.url})`, backgroundSize: "cover" }} />
                  {bg.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VisualBackgroundControls;
