
interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
}

class AccessibilityService {
  private settings: AccessibilitySettings;

  constructor() {
    this.settings = this.loadSettings();
    this.applySettings();
    this.setupKeyboardNavigation();
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

  private getDefaultSettings(): AccessibilitySettings {
    return {
      highContrast: false,
      largeText: false,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      screenReaderMode: false,
      keyboardNavigation: true,
      focusIndicators: true,
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('accessibility_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }

  private applySettings(): void {
    const root = document.documentElement;

    // High contrast mode
    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text mode
    if (this.settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (this.settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Focus indicators
    if (this.settings.focusIndicators) {
      root.classList.add('focus-indicators');
    } else {
      root.classList.remove('focus-indicators');
    }
  }

  private setupKeyboardNavigation(): void {
    if (!this.settings.keyboardNavigation) return;

    document.addEventListener('keydown', (event) => {
      // Skip to main content with Alt+M
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const main = document.querySelector('main') || document.querySelector('[role="main"]');
        if (main && main instanceof HTMLElement) {
          main.focus();
        }
      }

      // Skip to navigation with Alt+N
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
        if (nav && nav instanceof HTMLElement) {
          nav.focus();
        }
      }
    });
  }

  private detectScreenReader(): void {
    // Simple screen reader detection
    const isScreenReader = window.navigator.userAgent.includes('NVDA') ||
                          window.navigator.userAgent.includes('JAWS') ||
                          window.speechSynthesis?.getVoices().length > 0;

    if (isScreenReader) {
      this.updateSetting('screenReaderMode', true);
    }
  }

  updateSetting(key: keyof AccessibilitySettings, value: boolean): void {
    this.settings[key] = value;
    this.saveSettings();
    this.applySettings();
  }

  getSettings(): AccessibilitySettings {
    return { ...this.settings };
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
      document.body.removeChild(announcement);
    }, 1000);
  }

  checkColorContrast(backgroundColor: string, textColor: string): boolean {
    // Simplified contrast check - in production, use a proper contrast calculation
    const bgLuminance = this.getLuminance(backgroundColor);
    const textLuminance = this.getLuminance(textColor);
    const contrast = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                    (Math.min(bgLuminance, textLuminance) + 0.05);
    
    return contrast >= 4.5; // WCAG AA standard
  }

  private getLuminance(color: string): number {
    // Simplified luminance calculation
    // In production, use a proper color library
    return 0.5; // Placeholder
  }

  addSkipLink(targetId: string, linkText: string): void {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = linkText;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      z-index: 1000;
      background: black;
      color: white;
      padding: 8px;
      text-decoration: none;
      transition: top 0.3s;
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
  
  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    accessibilityService.updateSetting(key, value);
  };

  const announce = (message: string) => {
    accessibilityService.announceToScreenReader(message);
  };

  return { settings, updateSetting, announce };
};
