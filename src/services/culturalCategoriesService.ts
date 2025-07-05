import { supabase } from "@/integrations/supabase/client";

export interface CulturalCategory {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const culturalCategoriesService = {
  async getCategories(): Promise<CulturalCategory[]> {
    const { data, error } = await supabase
      .from('cultural_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching cultural categories:', error);
      return [];
    }

    return data || [];
  },

  async getCategoryById(id: string): Promise<CulturalCategory | null> {
    const { data, error } = await supabase
      .from('cultural_categories')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching cultural category:', error);
      return null;
    }

    return data;
  },

  async getStoriesByCategory(categoryId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles!stories_author_id_fkey(
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories by category:', error);
      return [];
    }

    return data || [];
  },

  async createCategory(category: Omit<CulturalCategory, 'id' | 'created_at' | 'updated_at'>): Promise<CulturalCategory | null> {
    const { data, error } = await supabase
      .from('cultural_categories')
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error('Error creating cultural category:', error);
      return null;
    }

    return data;
  },

  async updateCategory(id: string, updates: Partial<CulturalCategory>): Promise<CulturalCategory | null> {
    const { data, error } = await supabase
      .from('cultural_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cultural category:', error);
      return null;
    }

    return data;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('cultural_categories')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting cultural category:', error);
      return false;
    }

    return true;
  }
};