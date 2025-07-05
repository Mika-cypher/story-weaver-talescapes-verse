import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface StoryChoice {
  scene_id: string;
  choice_id: string;
  choice_text: string;
  timestamp: string;
}

export interface StoryProgress {
  id: string;
  user_id: string;
  story_id: string;
  current_scene_id: string | null;
  scenes_visited: string[];
  choices_made: Json;
  completion_percentage: number;
  last_read_at: string;
  created_at: string;
  updated_at: string;
}

export interface ParsedStoryProgress extends Omit<StoryProgress, 'choices_made'> {
  choices_made: StoryChoice[];
}

export const storyProgressService = {
  // Helper function to parse choices_made from Json to StoryChoice[]
  parseChoicesMade(choicesJson: Json): StoryChoice[] {
    if (!choicesJson || choicesJson === null) return [];
    try {
      const parsed = Array.isArray(choicesJson) ? choicesJson : JSON.parse(choicesJson as string);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async getProgress(userId: string, storyId: string): Promise<ParsedStoryProgress | null> {
    const { data, error } = await supabase
      .from('user_story_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('story_id', storyId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching story progress:', error);
      return null;
    }
    
    if (!data) return null;

    return {
      ...data,
      choices_made: this.parseChoicesMade(data.choices_made)
    };
  },

  async updateProgress(
    userId: string, 
    storyId: string, 
    updates: {
      current_scene_id?: string;
      scenes_visited?: string[];
      choices_made?: StoryChoice[];
      completion_percentage?: number;
    }
  ): Promise<ParsedStoryProgress | null> {
    const { data, error } = await supabase
      .from('user_story_progress')
      .upsert({
        user_id: userId,
        story_id: storyId,
        ...updates,
        choices_made: updates.choices_made ? JSON.stringify(updates.choices_made) : undefined,
        last_read_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating story progress:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      choices_made: this.parseChoicesMade(data.choices_made)
    };
  },

  async getUserProgressList(userId: string): Promise<(ParsedStoryProgress & { stories: any })[]> {
    const { data, error } = await supabase
      .from('user_story_progress')
      .select(`
        *,
        stories!inner(
          id,
          title,
          cover_image_url,
          description
        )
      `)
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false });

    if (error) {
      console.error('Error fetching user progress list:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      choices_made: this.parseChoicesMade(item.choices_made)
    }));
  },

  async deleteProgress(userId: string, storyId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_story_progress')
      .delete()
      .eq('user_id', userId)
      .eq('story_id', storyId);

    if (error) {
      console.error('Error deleting story progress:', error);
      return false;
    }

    return true;
  }
};