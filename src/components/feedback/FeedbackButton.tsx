
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, Bug, Lightbulb, Star } from 'lucide-react';

const FeedbackButton: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      // Store feedback in localStorage for now
      const feedbackData = {
        id: Date.now().toString(),
        type: feedbackType,
        message: feedback,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      const existingFeedback = JSON.parse(localStorage.getItem('beta_feedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('beta_feedback', JSON.stringify(existingFeedback));

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for helping us improve Talescapes.",
      });

      setFeedback('');
      setFeedbackType('');
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
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Beta Feedback
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Beta Feedback</SheetTitle>
          <SheetDescription>
            Help us improve Talescapes by sharing your thoughts, reporting bugs, or suggesting features.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Feedback Type</label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">
                  <div className="flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Bug Report
                  </div>
                </SelectItem>
                <SelectItem value="feature">
                  <div className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Feature Request
                  </div>
                </SelectItem>
                <SelectItem value="general">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    General Feedback
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Rating & Review
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Your Feedback</label>
            <Textarea
              placeholder="Tell us about your experience, report a bug, or suggest an improvement..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackButton;
