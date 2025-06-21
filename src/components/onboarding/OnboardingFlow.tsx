
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Users, Lightbulb, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { betaAnalyticsService } from '@/services/betaAnalyticsService';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome to Talescapes Beta!",
    description: "Create and explore immersive interactive stories",
    icon: <Book className="w-8 h-8" />,
    content: "You're part of our exclusive beta program! Explore interactive stories, create your own adventures, and help us shape the future of digital storytelling.",
  },
  {
    title: "Explore Interactive Stories",
    description: "Discover community-created adventures",
    icon: <Star className="w-8 h-8" />,
    content: "Visit the Explore page to find sample stories. Each story adapts to your choices, creating unique experiences every time you play.",
  },
  {
    title: "Create Your Own Stories",
    description: "Build branching narratives with our story builder",
    icon: <Lightbulb className="w-8 h-8" />,
    content: "Use the Create page to build your own interactive stories. Add scenes, choices, and create branching paths that respond to reader decisions.",
  },
  {
    title: "Join the Community",
    description: "Connect with other storytellers and creators",
    icon: <Users className="w-8 h-8" />,
    content: "Share your stories, get feedback, and collaborate with other creators. Your input helps us improve the platform for everyone!",
  },
];

interface OnboardingFlowProps {
  open: boolean;
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ open, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (open) {
      betaAnalyticsService.trackFeatureUsage('onboarding_started');
    }
  }, [open]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      betaAnalyticsService.trackFeatureUsage('onboarding_next', { step: currentStep + 1 });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    betaAnalyticsService.trackFeatureUsage('onboarding_completed');
    onComplete();
  };

  const handleSkip = () => {
    betaAnalyticsService.trackFeatureUsage('onboarding_skipped', { step: currentStep });
    onComplete();
  };

  const step = onboardingSteps[currentStep];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Beta
            </Badge>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>
          <DialogTitle className="flex items-center gap-3">
            {step.icon}
            {step.title}
          </DialogTitle>
          <DialogDescription>
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="pt-6">
            <p className="text-foreground leading-relaxed">
              {step.content}
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tour
            </Button>
          </div>

          <Button onClick={handleNext}>
            {currentStep === onboardingSteps.length - 1 ? (
              "Get Started"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-1 justify-center pt-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
