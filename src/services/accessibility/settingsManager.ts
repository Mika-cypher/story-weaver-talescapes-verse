
import { AccessibilitySettings, StoryAccessibilitySettings } from './types';

export class AccessibilitySettingsManager {
  private settings: AccessibilitySettings;
  private storySettings: StoryAccessibilitySettings;

  constructor() {
    this.settings = this.loadSettings();
    this.storySettings = this.loadStorySettings();
  }

  private loadSettings(): AccessibilitySettings {
    try {
      const stored = localStorage.getItem('accessibility_settings');
      if (stored) {
        return { ...this.getDefaultSettings(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
    
    return this.getDefaultSettings();
  }

  private loadStorySettings(): StoryAccessibilitySettings {
    try {
      const stored = localStorage.getItem('story_accessibility_settings');
      if (stored) {
        return { ...this.getDefaultStorySettings(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load story accessibility settings:', error);
    }
    
    return this.getDefaultStorySettings();
  }

  private getDefaultSettings(): AccessibilitySettings {
    return {
      highContrast: false,
      largeText: false,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      screenReaderMode: false,
      keyboardNavigation: true,
      focusIndicators: true,
      dyslexiaFriendlyFont: false,
      autoPlay: false,
      captionsEnabled: true,
    };
  }

  private getDefaultStorySettings(): StoryAccessibilitySettings {
    return {
      announceSceneChanges: true,
      announceModeChanges: true,
      announceSettingsChanges: true,
      keyboardShortcuts: true,
      skipLinks: true,
      audioDescriptions: false,
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('accessibility_settings', JSON.stringify(this.settings));
      localStorage.setItem('story_accessibility_settings', JSON.stringify(this.storySettings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }

  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  getStorySettings(): StoryAccessibilitySettings {
    return { ...this.storySettings };
  }

  updateSetting(key: keyof AccessibilitySettings, value: boolean): void {
    this.settings[key] = value;
    this.saveSettings();
  }

  updateStorySetting(key: keyof StoryAccessibilitySettings, value: boolean): void {
    this.storySettings[key] = value;
    this.saveSettings();
  }
}
