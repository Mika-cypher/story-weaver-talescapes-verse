import { supabase } from "@/integrations/supabase/client";
import { Review } from "./types";

export const reviewService = {
  async getReviews(contentId: string, contentType: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!fk_reviews_user_profile (
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
  }
};
