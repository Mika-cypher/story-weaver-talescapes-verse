// Local storage keys
export const SUBMISSIONS_KEY = "talescapes_submissions";

export class SubmissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubmissionError';
  }
}

import { supabase } from "@/integrations/supabase/client";

export const submissionService = {
  /**
   * Get user's submissions from Supabase (with localStorage fallback)
   */
  getUserSubmissions: async (userId: string): Promise<any[]> => {
    if (!userId) {
      return [];
    }
    
    try {
      // Try to get from Supabase first
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        const { data, error } = await supabase
          .from('creator_media')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          return data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            type: item.media_type,
            submittedAt: item.created_at,
            status: item.is_public ? 'published' : 'draft',
            userId: item.user_id,
            userName: 'User' // Will be populated from profiles in a real implementation
          }));
        }
      }
      
      // Fallback to localStorage
      const submissions = localStorage.getItem(`${SUBMISSIONS_KEY}_${userId}`);
      return submissions ? JSON.parse(submissions) : [];
    } catch (error) {
      console.error("Error fetching user submissions:", error);
      // Fallback to localStorage on error
      try {
        const submissions = localStorage.getItem(`${SUBMISSIONS_KEY}_${userId}`);
        return submissions ? JSON.parse(submissions) : [];
      } catch {
        return [];
      }
    }
  },
  
  /**
   * Submit content to Supabase (with localStorage fallback)
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
      
      // Try to submit to Supabase first
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        const { error } = await supabase
          .from('creator_media')
          .insert({
            user_id: userId,
            title: content.title,
            description: content.description,
            media_type: content.type || 'document',
            file_url: content.fileUrl || '',
            is_public: false, // Submissions start as private
            is_featured: false,
            license_type: 'all_rights_reserved'
          });
        
        if (!error) {
          return true;
        }
        
        console.error("Supabase submission error:", error);
        // Fall through to localStorage on error
      }
      
      // Fallback to localStorage
      const submission = {
        ...content,
        id: `sub_${Date.now()}`,
        userId: userId,
        userName: username,
        submittedAt: new Date().toISOString(),
        status: "pending",
      };
      
      const userSubmissions = await submissionService.getUserSubmissions(userId);
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
