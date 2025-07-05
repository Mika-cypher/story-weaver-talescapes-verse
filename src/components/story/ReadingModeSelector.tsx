
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BookOpen, Headphones, Volume2 } from 'lucide-react';

interface ReadingModeSelectorProps {
  selectedMode: 'text' | 'audio' | 'both';
  onModeChange: (mode: 'text' | 'audio' | 'both') => void;
  hasAudio: boolean;
}

const ReadingModeSelector: React.FC<ReadingModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  hasAudio
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Reading Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMode} onValueChange={onModeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text" className="flex items-center gap-2 cursor-pointer">
              <BookOpen className="h-4 w-4" />
              Text Only
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="audio" 
              id="audio" 
              disabled={!hasAudio}
            />
            <Label 
              htmlFor="audio" 
              className={`flex items-center gap-2 cursor-pointer ${!hasAudio ? 'opacity-50' : ''}`}
            >
              <Headphones className="h-4 w-4" />
              Audio Only {!hasAudio && '(Add audio first)'}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="both" 
              id="both" 
              disabled={!hasAudio}
            />
            <Label 
              htmlFor="both" 
              className={`flex items-center gap-2 cursor-pointer ${!hasAudio ? 'opacity-50' : ''}`}
            >
              <Volume2 className="h-4 w-4" />
              Text + Audio {!hasAudio && '(Add audio first)'}
            </Label>
          </div>
        </RadioGroup>
        
        <p className="text-sm text-muted-foreground mt-3">
          Choose how readers will experience your creation. Audio modes require narration to be added.
        </p>
      </CardContent>
    </Card>
  );
};

export default ReadingModeSelector;
