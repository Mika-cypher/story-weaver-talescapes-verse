import { StoryAccessibilitySettings } from './types';

export class KeyboardManager {
  private focusHistory: HTMLElement[] = [];

  constructor(
    private storySettings: StoryAccessibilitySettings,
    private keyboardEnabled: boolean
  ) {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
  }

  private setupKeyboardNavigation(): void {
    if (!this.keyboardEnabled) return;

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
}
