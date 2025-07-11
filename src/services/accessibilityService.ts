interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  dyslexiaFriendlyFont: boolean;
  autoPlay: boolean;
  captionsEnabled: boolean;
}

interface StoryAccessibilitySettings {
  announceSceneChanges: boolean;
  announceModeChanges: boolean;
  announceSettingsChanges: boolean;
  keyboardShortcuts: boolean;
  skipLinks: boolean;
  audioDescriptions: boolean;
}

class AccessibilityService {
  private settings: AccessibilitySettings;
  private storySettings: StoryAccessibilitySettings;
  private focusHistory: HTMLElement[] = [];

  constructor() {
    this.settings = this.loadSettings();
    this.storySettings = this.loadStorySettings();
    this.applySettings();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.detectScreenReader();
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

  private applySettings(): void {
    const root = document.documentElement;

    // High contrast mode
    root.classList.toggle('high-contrast', this.settings.highContrast);
    
    // Large text mode
    root.classList.toggle('large-text', this.settings.largeText);
    
    // Reduced motion
    root.classList.toggle('reduced-motion', this.settings.reducedMotion);
    
    // Focus indicators
    root.classList.toggle('focus-indicators', this.settings.focusIndicators);
    
    // Dyslexia-friendly font
    root.classList.toggle('dyslexia-font', this.settings.dyslexiaFriendlyFont);
  }

  private setupKeyboardNavigation(): void {
    if (!this.settings.keyboardNavigation) return;

    document.addEventListener('keydown', (event) => {
      // Global keyboard shortcuts
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'm':
            event.preventDefault();
            this.focusMainContent();
            break;
          case 'n':
            event.preventDefault();
            this.focusNavigation();
            break;
          case 's':
            event.preventDefault();
            this.focusStorySettings();
            break;
        }
      }

      // Story-specific shortcuts
      if (this.storySettings.keyboardShortcuts) {
        switch (event.key) {
          case 'Escape':
            event.preventDefault();
            this.closeActivePanel();
            break;
          case ' ':
            if (event.target instanceof HTMLElement && !['INPUT', 'TEXTAREA', 'BUTTON'].includes(event.target.tagName)) {
              event.preventDefault();
              this.toggleAudio();
            }
            break;
        }

        // Number keys for mode switching
        if (event.key >= '1' && event.key <= '4') {
          event.preventDefault();
          this.switchReadingMode(parseInt(event.key) - 1);
        }
      }
    });
  }

  private setupFocusManagement(): void {
    // Track focus history for restoration
    document.addEventListener('focusin', (event) => {
      if (event.target instanceof HTMLElement) {
        this.focusHistory.push(event.target);
        // Keep only last 5 focus points
        if (this.focusHistory.length > 5) {
          this.focusHistory.shift();
        }
      }
    });
  }

  private detectScreenReader(): void {
    const isScreenReader = window.navigator.userAgent.includes('NVDA') ||
                          window.navigator.userAgent.includes('JAWS') ||
                          window.speechSynthesis?.getVoices().length > 0 ||
                          window.navigator.userAgent.includes('VoiceOver');

    if (isScreenReader) {
      this.updateSetting('screenReaderMode', true);
    }
  }

  // Public methods for story reader integration
  updateSetting(key: keyof AccessibilitySettings, value: boolean): void {
    this.settings[key] = value;
    this.saveSettings();
    this.applySettings();
    
    if (this.storySettings.announceSettingsChanges) {
      this.announceToScreenReader(`${key} ${value ? 'enabled' : 'disabled'}`);
    }
  }

  updateStorySetting(key: keyof StoryAccessibilitySettings, value: boolean): void {
    this.storySettings[key] = value;
    this.saveSettings();
  }

  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  getStorySettings(): StoryAccessibilitySettings {
    return { ...this.storySettings };
  }

  announceToScreenReader(message: string): void {
    if (!this.settings.screenReaderMode) return;

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

  // Focus management methods
  focusMainContent(): void {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main instanceof HTMLElement) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  }

  focusNavigation(): void {
    const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    if (nav instanceof HTMLElement) {
      const firstFocusable = nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();
      }
    }
  }

  focusStorySettings(): void {
    const settingsButton = document.querySelector('[data-story-settings]');
    if (settingsButton instanceof HTMLElement) {
      settingsButton.focus();
    }
  }

  closeActivePanel(): void {
    const closeButton = document.querySelector('[data-panel-close]:not([style*="display: none"])');
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
    }
  }

  toggleAudio(): void {
    const audioToggle = document.querySelector('[data-audio-toggle]');
    if (audioToggle instanceof HTMLElement) {
      audioToggle.click();
    }
  }

  switchReadingMode(modeIndex: number): void {
    const modes = ['text', 'audio', 'multimedia', 'immersive'];
    const modeButton = document.querySelector(`[data-mode="${modes[modeIndex]}"]`);
    if (modeButton instanceof HTMLElement) {
      modeButton.click();
    }
  }

  // Focus trap for modals
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Restore focus to previous element
  restoreFocus(): void {
    const lastFocused = this.focusHistory[this.focusHistory.length - 2];
    if (lastFocused && document.body.contains(lastFocused)) {
      lastFocused.focus();
    }
  }

  checkColorContrast(backgroundColor: string, textColor: string): boolean {
    const bgLuminance = this.getLuminance(backgroundColor);
    const textLuminance = this.getLuminance(textColor);
    const contrast = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                    (Math.min(bgLuminance, textLuminance) + 0.05);
    
    return contrast >= 4.5; // WCAG AA standard
  }

  private getLuminance(color: string): number {
    // Simplified luminance calculation - in production use proper color library
    return 0.5;
  }

  addSkipLink(targetId: string, linkText: string): void {
    if (!this.storySettings.skipLinks) return;

    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = linkText;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      z-index: 1000;
      background: hsl(var(--background));
      color: hsl(var(--foreground));
      padding: 8px 16px;
      text-decoration: none;
      border: 2px solid hsl(var(--primary));
      border-radius: 4px;
      transition: top 0.3s;
      font-weight: 500;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
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
