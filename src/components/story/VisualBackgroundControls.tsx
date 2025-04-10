
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
import { useToast } from "@/hooks/use-toast";
import { 
  backgroundOptions, 
  getBackgroundName, 
  getBackgroundUrl 
} from "@/utils/storyBackgroundOptions";

interface VisualBackgroundControlsProps {
  storyId: number;
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
    </div>
  );
};

export default VisualBackgroundControls;
