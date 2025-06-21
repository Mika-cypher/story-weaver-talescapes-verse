
import { useToast } from "@/hooks/use-toast";
import { submissionService, SubmissionError } from "@/services/submissionService";
import { ExtendedUser } from "@/types/auth";

export const useSubmissionOperations = () => {
  const { toast } = useToast();

  const getUserSubmissions = async (user: ExtendedUser | null): Promise<any[]> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to access your submissions",
        variant: "destructive",
      });
      return [];
    }
    
    try {
      return await submissionService.getUserSubmissions(user.id);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return [];
    }
  };
  
  const submitContent = async (user: ExtendedUser | null, content: any): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit content",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const result = await submissionService.submitContent(user.id, user.username || 'user', content);
      
      toast({
        title: "Submission Received",
        description: "Your content has been submitted for review",
      });
      
      return result;
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error instanceof SubmissionError ? error.message : "Could not submit content",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    getUserSubmissions,
    submitContent
  };
};
