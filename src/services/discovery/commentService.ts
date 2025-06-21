
import { supabase } from "@/integrations/supabase/client";
import { ContentComment } from "./types";

export const commentService = {
  async getComments(contentId: string, contentType: string): Promise<ContentComment[]> {
    const { data, error } = await supabase
      .from('content_comments')
      .select(`
        *,
        profiles!inner (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ContentComment[];
  },

  async createComment(comment: Omit<ContentComment, 'id' | 'created_at' | 'updated_at' | 'profiles'>): Promise<ContentComment> {
    const { data, error } = await supabase
      .from('content_comments')
      .insert(comment)
      .select()
      .single();

    if (error) throw error;
    return data as ContentComment;
  },

  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('content_comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
