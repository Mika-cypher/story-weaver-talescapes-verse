
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsEvent {
  id: string;
  content_id: string;
  content_type: 'story' | 'media' | 'portfolio';
  user_id?: string;
  event_type: 'view' | 'like' | 'share' | 'download' | 'commission_request';
  created_at: string;
}

export const analyticsService = {
  // Track an event
  async trackEvent(
    contentId: string, 
    contentType: AnalyticsEvent['content_type'], 
    eventType: AnalyticsEvent['event_type'],
    userId?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('content_analytics')
      .insert({
        content_id: contentId,
        content_type: contentType,
        event_type: eventType,
        user_id: userId
      });
    
    if (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - analytics shouldn't break user experience
    }
  },

  // Get analytics for content owner
  async getContentAnalytics(contentId: string): Promise<{ [key: string]: number }> {
    const { data, error } = await supabase
      .from('content_analytics')
      .select('event_type')
      .eq('content_id', contentId);
    
    if (error) throw error;
    
    const analytics: { [key: string]: number } = {};
    data?.forEach(event => {
      analytics[event.event_type] = (analytics[event.event_type] || 0) + 1;
    });
    
    return analytics;
  },

  // Get user's content performance
  async getUserAnalytics(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('content_analytics')
      .select('*')
      .or(`user_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};
