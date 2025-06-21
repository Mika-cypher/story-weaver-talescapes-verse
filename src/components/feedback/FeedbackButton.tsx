
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, Bug, Lightbulb, Star, Send } from 'lucide-react';
import { betaAnalyticsService } from '@/services/betaAnalyticsService';
import { betaTestingService } from '@/services/betaTestingService';
import { sessionManagementService } from '@/services/sessionManagementService';

const FeedbackButton: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedbackType || !feedback.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a feedback type and enter your feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Enhanced feedback data with session and testing info
      const feedbackData = {
        id: Date.now().toString(),
        type: feedbackType,
        message: feedback,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionData: sessionManagementService.getSession(),
        testVariants: betaTestingService.getUserTestVariants(),
        feedbackLength: feedback.length,
      };

      // Store feedback
      const existingFeedback = JSON.parse(localStorage.getItem('beta_feedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('beta_feedback', JSON.stringify(existingFeedback));

      // Track in analytics
      betaAnalyticsService.trackFeedback(feedbackType, feedback.length);

      // Update beta user stats
      betaTestingService.updateBetaUserStats({
        feedback: (betaTestingService.getBetaUserStats()?.feedback || 0) + 1,
      });

      // Track conversion for feedback A/B test
      betaTestingService.trackConversion('feedback_flow', 'feedback_submitted');

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for helping us improve Talescapes. Your feedback is invaluable for our beta development.",
      });

      setFeedback('');
      setFeedbackType('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg animate-pulse"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Beta Feedback
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Beta Feedback
          </SheetTitle>
          <SheetDescription>
            Your feedback shapes the future of Talescapes! Help us create the best storytelling experience by sharing your thoughts, reporting bugs, or suggesting features.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">What kind of feedback do you have?</label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">
                  <div className="flex items-center">
                    <Bug className="w-4 h-4 mr-2 text-red-500" />
                    Bug Report - Something isn't working
                  </div>
                </SelectItem>
                <SelectItem value="feature">
                  <div className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                    Feature Request - I have an idea
                  </div>
                </SelectItem>
                <SelectItem value="general">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                    General Feedback - Overall thoughts
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-purple-500" />
                    Rating & Review - Rate your experience
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tell us more</label>
            <Textarea
              placeholder="Be as detailed as possible! Include steps to reproduce bugs, describe your ideal feature, or share what you love (or don't love) about the app..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {feedback.length}/1000 characters
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground">
            <p className="font-medium mb-1">What we collect:</p>
            <p>• Your feedback and the page you're on</p>
            <p>• Anonymous usage data to help us improve</p>
            <p>• No personal information unless you choose to share it</p>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !feedbackType || !feedback.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackButton;
