
import { supabase } from "@/integrations/supabase/client";

export interface CreatorMedia {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  media_type: 'image' | 'audio' | 'video' | 'document';
  file_url: string;
  file_size?: number;
  mime_type?: string;
  tags?: string[];
  category?: string;
  is_public: boolean;
  is_featured: boolean;
  license_type: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  is_public: boolean;
  portfolio_type: string;
  created_at: string;
  updated_at: string;
  items?: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  portfolio_id: string;
  media_id: string;
  order_index: number;
  media?: CreatorMedia;
}

export const mediaService = {
  // Upload file to Supabase Storage
  async uploadFile(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('creator-media')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('creator-media')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },

  // Create media record
  async createMedia(mediaData: Omit<CreatorMedia, 'id' | 'created_at' | 'updated_at'>): Promise<CreatorMedia> {
    const { data, error } = await supabase
      .from('creator_media')
      .insert(mediaData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user's media
  async getUserMedia(userId: string): Promise<CreatorMedia[]> {
    const { data, error } = await supabase
      .from('creator_media')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get public media
  async getPublicMedia(mediaType?: string): Promise<CreatorMedia[]> {
    let query = supabase
      .from('creator_media')
      .select('*')
      .eq('is_public', true);
    
    if (mediaType) {
      query = query.eq('media_type', mediaType);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Update media
  async updateMedia(id: string, updates: Partial<CreatorMedia>): Promise<CreatorMedia> {
    const { data, error } = await supabase
      .from('creator_media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete media
  async deleteMedia(id: string): Promise<void> {
    const { error } = await supabase
      .from('creator_media')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Portfolio operations
  async createPortfolio(portfolioData: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>): Promise<Portfolio> {
    const { data, error } = await supabase
      .from('portfolios')
      .insert(portfolioData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        portfolio_items!inner(
          id,
          order_index,
          creator_media(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addToPortfolio(portfolioId: string, mediaId: string, orderIndex: number = 0): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        portfolio_id: portfolioId,
        media_id: mediaId,
        order_index: orderIndex
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
