
import { AccessibilitySettingsManager } from './settingsManager';
import { AccessibilityDOMManager } from './domManager';
import { KeyboardManager } from './keyboardManager';
import { ScreenReaderManager } from './screenReaderManager';
import { AccessibilitySettings, StoryAccessibilitySettings } from './types';

class AccessibilityService {
  private settingsManager: AccessibilitySettingsManager;
  private domManager: AccessibilityDOMManager;
  private keyboardManager: KeyboardManager;
  private screenReaderManager: ScreenReaderManager;

  constructor() {
    this.settingsManager = new AccessibilitySettingsManager();
    this.domManager = new AccessibilityDOMManager();
    
    const settings = this.settingsManager.getSettings();
    const storySettings = this.settingsManager.getStorySettings();
    
    this.keyboardManager = new KeyboardManager(storySettings, settings.keyboardNavigation);
    this.screenReaderManager = new ScreenReaderManager(storySettings, settings.screenReaderMode);
    
    this.applySettings();
  }

  private applySettings(): void {
    const settings = this.settingsManager.getSettings();
    this.domManager.applySettings(settings);
  }

  // Public methods for story reader integration
  updateSetting(key: keyof AccessibilitySettings, value: boolean): void {
    this.settingsManager.updateSetting(key, value);
    this.applySettings();
    
    this.screenReaderManager.announceSettingChange(key, value);
  }

  updateStorySetting(key: keyof StoryAccessibilitySettings, value: boolean): void {
    this.settingsManager.updateStorySetting(key, value);
  }

  getSettings(): AccessibilitySettings {
    return this.settingsManager.getSettings();
  }

  getStorySettings(): StoryAccessibilitySettings {
    return this.settingsManager.getStorySettings();
  }

  announceToScreenReader(message: string): void {
    this.screenReaderManager.announceToScreenReader(message);
  }

  announceSceneChange(sceneTitle: string): void {
    this.screenReaderManager.announceSceneChange(sceneTitle);
  }

  announceModeChange(mode: string): void {
    this.screenReaderManager.announceModeChange(mode);
  }

  // Focus management methods
  focusMainContent(): void {
    this.keyboardManager.focusMainContent();
  }

  focusNavigation(): void {
    this.keyboardManager.focusNavigation();
  }

  focusStorySettings(): void {
    this.keyboardManager.focusStorySettings();
  }

  closeActivePanel(): void {
    this.keyboardManager.closeActivePanel();
  }

  toggleAudio(): void {
    this.keyboardManager.toggleAudio();
  }

  switchReadingMode(modeIndex: number): void {
    this.keyboardManager.switchReadingMode(modeIndex);
  }

  trapFocus(container: HTMLElement): () => void {
    return this.keyboardManager.trapFocus(container);
  }

  restoreFocus(): void {
    this.keyboardManager.restoreFocus();
  }

  checkColorContrast(backgroundColor: string, textColor: string): boolean {
    return this.domManager.checkColorContrast(backgroundColor, textColor);
  }

  addSkipLink(targetId: string, linkText: string): void {
    const storySettings = this.settingsManager.getStorySettings();
    if (storySettings.skipLinks) {
      this.domManager.addSkipLink(targetId, linkText);
    }
  }
}

export const accessibilityService = new AccessibilityService();

// React hook for accessibility settings
export const useAccessibility = () => {
  const settings = accessibilityService.getSettings();
  const storySettings = accessibilityService.getStorySettings();
  
  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    accessibilityService.updateSetting(key, value);
  };

  const updateStorySetting = (key: keyof StoryAccessibilitySettings, value: boolean) => {
    accessibilityService.updateStorySetting(key, value);
  };

  const announce = (message: string) => {
    accessibilityService.announceToScreenReader(message);
  };

  return { 
    settings, 
    storySettings, 
    updateSetting, 
    updateStorySetting, 
    announce,
    announceSceneChange: accessibilityService.announceSceneChange.bind(accessibilityService),
    announceModeChange: accessibilityService.announceModeChange.bind(accessibilityService),
    trapFocus: accessibilityService.trapFocus.bind(accessibilityService),
    restoreFocus: accessibilityService.restoreFocus.bind(accessibilityService)
  };
};
