
import { AccessibilitySettings } from './types';

export class AccessibilityDOMManager {
  applySettings(settings: AccessibilitySettings): void {
    const root = document.documentElement;

    // High contrast mode
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Large text mode
    root.classList.toggle('large-text', settings.largeText);
    
    // Reduced motion
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    
    // Focus indicators
    root.classList.toggle('focus-indicators', settings.focusIndicators);
    
    // Dyslexia-friendly font
    root.classList.toggle('dyslexia-font', settings.dyslexiaFriendlyFont);
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
}
