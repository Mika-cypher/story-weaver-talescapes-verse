
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'story' | 'song' | 'dialect';
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface UserList {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'story' | 'song' | 'dialect';
  list_type: 'want_to_read' | 'currently_reading' | 'read' | 'want_to_listen' | 'currently_listening' | 'listened';
  created_at: string;
}

export interface ContentComment {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'story' | 'song' | 'dialect';
  comment_text: string;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export const discoveryService = {
  // Reviews
  async getReviews(contentId: string, contentType: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Review[];
  },

  async createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'profiles'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  async updateReview(id: string, updates: Partial<Pick<Review, 'rating' | 'review_text'>>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getAverageRating(contentId: string, contentType: string): Promise<{ average: number; count: number }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = data.reduce((acc, review) => acc + review.rating, 0);
    return {
      average: sum / data.length,
      count: data.length
    };
  },

  // User Lists
  async getUserList(userId: string, contentType: string): Promise<UserList[]> {
    const { data, error } = await supabase
      .from('user_lists')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as UserList[];
  },

  async addToList(listItem: Omit<UserList, 'id' | 'created_at'>): Promise<UserList> {
    const { data, error } = await supabase
      .from('user_lists')
      .upsert(listItem)
      .select()
      .single();

    if (error) throw error;
    return data as UserList;
  },

  async removeFromList(userId: string, contentId: string, contentType: string): Promise<void> {
    const { error } = await supabase
      .from('user_lists')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    if (error) throw error;
  },

  async getUserListStatus(userId: string, contentId: string, contentType: string): Promise<UserList | null> {
    const { data, error } = await supabase
      .from('user_lists')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .maybeSingle();

    if (error) throw error;
    return data as UserList | null;
  },

  // Comments
  async getComments(contentId: string, contentType: string): Promise<ContentComment[]> {
    const { data, error } = await supabase
      .from('content_comments')
      .select(`
        *,
        profiles!content_comments_user_id_fkey (
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
