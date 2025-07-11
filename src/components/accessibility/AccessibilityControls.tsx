
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Volume2, 
  Type, 
  Palette, 
  Keyboard, 
  Accessibility,
  Settings,
  RotateCcw
} from 'lucide-react';
import { useAccessibility } from '@/services/accessibilityService';

interface AccessibilityControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    settings, 
    storySettings, 
    updateSetting, 
    updateStorySetting,
    announce
  } = useAccessibility();

  const handleSettingChange = (key: string, value: boolean) => {
    updateSetting(key as any, value);
    announce(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleStorySettingChange = (key: string, value: boolean) => {
    updateStorySetting(key as any, value);
    announce(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReaderMode: false,
      keyboardNavigation: true,
      focusIndicators: true,
      dyslexiaFriendlyFont: false,
      autoPlay: false,
      captionsEnabled: true,
    };

    Object.entries(defaultSettings).forEach(([key, value]) => {
      updateSetting(key as any, value);
    });

    announce('Accessibility settings reset to defaults');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="accessibility-title"
      aria-describedby="accessibility-description"
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto panel-accessible"
        role="document"
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Accessibility className="h-5 w-5 text-primary" />
              <CardTitle id="accessibility-title">Accessibility Settings</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close accessibility settings"
              data-panel-close
            >
              ×
            </Button>
          </div>
          <p id="accessibility-description" className="text-sm text-muted-foreground">
            Customize your reading experience for better accessibility and comfort.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Visual Accessibility */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-lg">Visual Accessibility</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="high-contrast" className="font-medium">
                    High Contrast Mode
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                  aria-describedby="high-contrast-description"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="large-text" className="font-medium">
                    Large Text
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Increase text size throughout the interface
                  </p>
                </div>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => handleSettingChange('largeText', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="dyslexia-font" className="font-medium">
                    Dyslexia-Friendly Font
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Use OpenDyslexic font for improved readability
                  </p>
                </div>
                <Switch
                  id="dyslexia-font"
                  checked={settings.dyslexiaFriendlyFont}
                  onCheckedChange={(checked) => handleSettingChange('dyslexiaFriendlyFont', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="focus-indicators" className="font-medium">
                    Enhanced Focus Indicators
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Show clear focus outlines for keyboard navigation
                  </p>
                </div>
                <Switch
                  id="focus-indicators"
                  checked={settings.focusIndicators}
                  onCheckedChange={(checked) => handleSettingChange('focusIndicators', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Motion & Animation */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-lg">Motion & Animation</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="reduced-motion" className="font-medium">
                  Reduce Motion
                </label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Audio & Media */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Volume2 className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-lg">Audio & Media</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="auto-play" className="font-medium">
                    Auto-play Audio
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Automatically play audio narration when available
                  </p>
                </div>
                <Switch
                  id="auto-play"
                  checked={settings.autoPlay}
                  onCheckedChange={(checked) => handleSettingChange('autoPlay', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="captions" className="font-medium">
                    Show Captions
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Display captions for audio content when available
                  </p>
                </div>
                <Switch
                  id="captions"
                  checked={settings.captionsEnabled}
                  onCheckedChange={(checked) => handleSettingChange('captionsEnabled', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Navigation */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Keyboard className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-lg">Navigation & Interaction</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="keyboard-nav" className="font-medium">
                    Keyboard Navigation
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Enable keyboard shortcuts and navigation
                  </p>
                </div>
                <Switch
                  id="keyboard-nav"
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => handleSettingChange('keyboardNavigation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="keyboard-shortcuts" className="font-medium">
                    Story Keyboard Shortcuts
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Enable shortcuts for story navigation (1-4 for modes, Space for play/pause)
                  </p>
                </div>
                <Switch
                  id="keyboard-shortcuts"
                  checked={storySettings.keyboardShortcuts}
                  onCheckedChange={(checked) => handleStorySettingChange('keyboardShortcuts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="skip-links" className="font-medium">
                    Skip Links
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Show skip links for faster navigation
                  </p>
                </div>
                <Switch
                  id="skip-links"
                  checked={storySettings.skipLinks}
                  onCheckedChange={(checked) => handleStorySettingChange('skipLinks', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Screen Reader */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-lg">Screen Reader</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="announce-scenes" className="font-medium">
                    Announce Scene Changes
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Read scene titles when navigating
                  </p>
                </div>
                <Switch
                  id="announce-scenes"
                  checked={storySettings.announceSceneChanges}
                  onCheckedChange={(checked) => handleStorySettingChange('announceSceneChanges', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="announce-modes" className="font-medium">
                    Announce Mode Changes
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Read mode names when switching reading modes
                  </p>
                </div>
                <Switch
                  id="announce-modes"
                  checked={storySettings.announceModeChanges}
                  onCheckedChange={(checked) => handleStorySettingChange('announceModeChanges', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="announce-settings" className="font-medium">
                    Announce Settings Changes
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Read confirmation when accessibility settings change
                  </p>
                </div>
                <Switch
                  id="announce-settings"
                  checked={storySettings.announceSettingsChanges}
                  onCheckedChange={(checked) => handleStorySettingChange('announceSettingsChanges', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Keyboard Shortcuts Help */}
          <div>
            <h3 className="font-medium text-lg mb-3">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Skip to main content:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + M</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Skip to navigation:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + N</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Story settings:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + S</kbd>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Reading modes:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">1-4</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Play/Pause audio:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Close panels:</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reset Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Reset Settings</h3>
              <p className="text-sm text-muted-foreground">
                Return all accessibility settings to their default values
              </p>
            </div>
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
