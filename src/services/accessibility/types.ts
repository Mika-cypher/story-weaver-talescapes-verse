
export interface AccessibilitySettings {
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

export interface StoryAccessibilitySettings {
  announceSceneChanges: boolean;
  announceModeChanges: boolean;
  announceSettingsChanges: boolean;
  keyboardShortcuts: boolean;
  skipLinks: boolean;
  audioDescriptions: boolean;
}
