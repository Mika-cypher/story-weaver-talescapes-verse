
import { Story } from "@/types/story";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseStory } from "./supabaseMapper";

const STORIES_KEY = "interactive_stories";

export const storyReader = {
  // Get stories (published for now), Supabase or localStorage depending on session
  getStories: async (): Promise<Story[]> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id, title, description, cover_image_url, author_id, created_at, updated_at, status, featured, start_scene_id
        `)
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Supabase story fetch error:", error);
        return [];
      }
      return data.map(item => mapSupabaseStory(item));
    } else {
      const stories = localStorage.getItem(STORIES_KEY);
      return stories ? JSON.parse(stories) : [];
    }
  },

  getStoryById: async (id: string): Promise<Story | undefined> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id, title, description, cover_image_url, author_id, created_at, updated_at, status, featured, start_scene_id
        `)
        .eq("id", id)
        .maybeSingle();
      if (error) {
        console.error("Supabase getStoryById error:", error);
        return undefined;
      }
      if (!data) {
        return undefined;
      }
      
      // Fetch scenes for story
      const { data: scenesData, error: scenesError } = await supabase
        .from("scenes")
        .select(`
          id, title, content, image_url, audio_url, is_ending, 
          choices (
            id, text, next_scene_id
          )
        `)
        .eq("story_id", id)
        .order("created_at", { ascending: true });

      if (scenesError) {
        console.error("Error fetching scenes:", scenesError);
      }

      const story = mapSupabaseStory(data);
      story.scenes = (scenesData || []).map(scene => ({
        id: scene.id,
        title: scene.title,
        content: scene.content,
        image: scene.image_url,
        audio: scene.audio_url,
        isEnding: scene.is_ending,
        choices: scene.choices.map((choice: any) => ({
          id: choice.id,
          text: choice.text,
          nextSceneId: choice.next_scene_id,
        })),
      }));
      
      return story;
    } else {
      const stories = await storyReader.getStories();
      return stories.find(story => story.id === id);
    }
  },

  getPublishedStories: async (): Promise<Story[]> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id, title, description, cover_image_url, author_id, created_at, updated_at, status, featured, start_scene_id
        `)
        .eq("status", "published")
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Supabase published fetch error:", error);
        return [];
      }
      return data.map(item => mapSupabaseStory(item));
    } else {
      const stories = await storyReader.getStories();
      return stories.filter(story => story.status === "published");
    }
  },

  getFeaturedStories: async (): Promise<Story[]> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id, title, description, cover_image_url, author_id, created_at, updated_at, status, featured, start_scene_id
        `)
        .eq("status", "published")
        .eq("featured", true)
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Supabase featured fetch error:", error);
        return [];
      }
      return data.map(item => mapSupabaseStory(item));
    } else {
      const stories = await storyReader.getStories();
      return stories.filter(story => story.status === "published" && story.featured);
    }
  },
};
