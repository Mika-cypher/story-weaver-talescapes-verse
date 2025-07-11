
import { StoryAccessibilitySettings } from './types';

export class ScreenReaderManager {
  private screenReaderMode: boolean;

  constructor(
    private storySettings: StoryAccessibilitySettings,
    screenReaderMode: boolean
  ) {
    this.screenReaderMode = screenReaderMode;
    this.detectScreenReader();
  }

  private detectScreenReader(): void {
    const isScreenReader = window.navigator.userAgent.includes('NVDA') ||
                          window.navigator.userAgent.includes('JAWS') ||
                          window.speechSynthesis?.getVoices().length > 0 ||
                          window.navigator.userAgent.includes('VoiceOver');

    if (isScreenReader) {
      this.screenReaderMode = true;
    }
  }

  announceToScreenReader(message: string): void {
    if (!this.screenReaderMode) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  announceSceneChange(sceneTitle: string): void {
    if (this.storySettings.announceSceneChanges) {
      this.announceToScreenReader(`Now reading: ${sceneTitle}`);
    }
  }

  announceModeChange(mode: string): void {
    if (this.storySettings.announceModeChanges) {
      this.announceToScreenReader(`Switched to ${mode} mode`);
    }
  }

  announceSettingChange(key: string, value: boolean): void {
    if (this.storySettings.announceSettingsChanges) {
      this.announceToScreenReader(`${key} ${value ? 'enabled' : 'disabled'}`);
    }
  }

  isScreenReaderMode(): boolean {
    return this.screenReaderMode;
  }

  setScreenReaderMode(enabled: boolean): void {
    this.screenReaderMode = enabled;
  }
}
