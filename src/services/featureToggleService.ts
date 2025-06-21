
interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  betaOnly?: boolean;
}

const defaultFeatures: FeatureFlag[] = [
  {
    name: 'enhanced_story_analytics',
    enabled: true,
    description: 'Advanced analytics for story performance',
    betaOnly: true,
  },
  {
    name: 'collaborative_editing',
    enabled: false,
    description: 'Allow multiple users to edit stories together',
    betaOnly: true,
  },
  {
    name: 'ai_story_suggestions',
    enabled: false,
    description: 'AI-powered story completion suggestions',
    betaOnly: true,
  },
  {
    name: 'advanced_media_editor',
    enabled: true,
    description: 'Enhanced media editing capabilities',
    betaOnly: true,
  },
  {
    name: 'story_templates',
    enabled: true,
    description: 'Pre-built story templates for quick starts',
    betaOnly: false,
  },
  {
    name: 'real_time_feedback',
    enabled: true,
    description: 'Real-time feedback and bug reporting',
    betaOnly: true,
  },
];

class FeatureToggleService {
  private features: Map<string, FeatureFlag> = new Map();

  constructor() {
    this.loadFeatures();
  }

  private loadFeatures(): void {
    try {
      const stored = localStorage.getItem('feature_toggles');
      if (stored) {
        const storedFeatures = JSON.parse(stored);
        // Merge with defaults, giving priority to stored settings
        defaultFeatures.forEach(feature => {
          const storedFeature = storedFeatures[feature.name];
          this.features.set(feature.name, {
            ...feature,
            enabled: storedFeature?.enabled ?? feature.enabled,
          });
        });
      } else {
        // Use defaults
        defaultFeatures.forEach(feature => {
          this.features.set(feature.name, feature);
        });
      }
    } catch (error) {
      console.error('Failed to load feature toggles:', error);
      // Fall back to defaults
      defaultFeatures.forEach(feature => {
        this.features.set(feature.name, feature);
      });
    }
  }

  private saveFeatures(): void {
    try {
      const featuresToSave: Record<string, { enabled: boolean }> = {};
      this.features.forEach((feature, name) => {
        featuresToSave[name] = { enabled: feature.enabled };
      });
      localStorage.setItem('feature_toggles', JSON.stringify(featuresToSave));
    } catch (error) {
      console.error('Failed to save feature toggles:', error);
    }
  }

  isEnabled(featureName: string): boolean {
    const feature = this.features.get(featureName);
    return feature?.enabled ?? false;
  }

  enable(featureName: string): void {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.enabled = true;
      this.saveFeatures();
    }
  }

  disable(featureName: string): void {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.enabled = false;
      this.saveFeatures();
    }
  }

  toggle(featureName: string): boolean {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.enabled = !feature.enabled;
      this.saveFeatures();
      return feature.enabled;
    }
    return false;
  }

  getAllFeatures(): FeatureFlag[] {
    return Array.from(this.features.values());
  }

  getBetaFeatures(): FeatureFlag[] {
    return Array.from(this.features.values()).filter(feature => feature.betaOnly);
  }

  getFeature(featureName: string): FeatureFlag | undefined {
    return this.features.get(featureName);
  }

  resetToDefaults(): void {
    defaultFeatures.forEach(feature => {
      this.features.set(feature.name, { ...feature });
    });
    this.saveFeatures();
  }
}

export const featureToggleService = new FeatureToggleService();
