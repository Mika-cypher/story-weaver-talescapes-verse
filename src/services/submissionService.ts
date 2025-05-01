
// Local storage keys
export const SUBMISSIONS_KEY = "talescapes_submissions";

export class SubmissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubmissionError';
  }
}

export const submissionService = {
  /**
   * Get user's submissions
   */
  getUserSubmissions: (userId: string): any[] => {
    if (!userId) {
      return [];
    }
    
    try {
      const submissions = localStorage.getItem(`${SUBMISSIONS_KEY}_${userId}`);
      return submissions ? JSON.parse(submissions) : [];
    } catch (error) {
      console.error("Error fetching user submissions:", error);
      return [];
    }
  },
  
  /**
   * Submit content
   */
  submitContent: async (userId: string, username: string, content: any): Promise<boolean> => {
    if (!userId) {
      throw new SubmissionError("Authentication required to submit content");
    }
    
    try {
      // Validate content submission
      if (!content || typeof content !== 'object') {
        throw new SubmissionError("Invalid content format");
      }
      
      // Required fields validation
      const requiredFields = ['title', 'description'];
      for (const field of requiredFields) {
        if (!content[field]) {
          throw new SubmissionError(`Missing required field: ${field}`);
        }
      }
      
      const submission = {
        ...content,
        id: `sub_${Date.now()}`,
        userId: userId,
        userName: username,
        submittedAt: new Date().toISOString(),
        status: "pending",
      };
      
      const userSubmissions = submissionService.getUserSubmissions(userId);
      const updatedSubmissions = [...userSubmissions, submission];
      
      localStorage.setItem(`${SUBMISSIONS_KEY}_${userId}`, JSON.stringify(updatedSubmissions));
      
      // Store in global submissions as well
      const allSubmissions = localStorage.getItem(SUBMISSIONS_KEY) || "[]";
      const parsedSubmissions = JSON.parse(allSubmissions);
      parsedSubmissions.push(submission);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(parsedSubmissions));
      
      return true;
    } catch (error) {
      console.error("Content submission error:", error);
      throw new SubmissionError(error instanceof Error ? error.message : "Failed to submit content");
    }
  }
};
