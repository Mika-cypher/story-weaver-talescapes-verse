
import { Story } from "@/types/story";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseStory } from "./supabaseMapper";
import { storyReader } from "./storyReader";

const STORIES_KEY = "interactive_stories";

export const storyUpdater = {
  updateStoryStatus: async (id: string, status: "draft" | "published"): Promise<Story | undefined> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data, error } = await supabase
        .from("stories")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) {
        console.error("Supabase story status update error:", error);
        return undefined;
      }
      return mapSupabaseStory(data);
    } else {
      const stories = await storyReader.getStories();
      const storyIndex = stories.findIndex(story => story.id === id);

      if (storyIndex >= 0) {
        stories[storyIndex].status = status;
        stories[storyIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
        return stories[storyIndex];
      }

      return undefined;
    }
  },

  updateStoryFeatured: async (id: string, featured: boolean): Promise<Story | undefined> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data, error } = await supabase
        .from("stories")
        .update({
          featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) {
        console.error("Supabase story featured update error:", error);
        return undefined;
      }
      return mapSupabaseStory(data);
    } else {
      const stories = await storyReader.getStories();
      const storyIndex = stories.findIndex(story => story.id === id);

      if (storyIndex >= 0) {
        stories[storyIndex].featured = featured;
        stories[storyIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
        return stories[storyIndex];
      }

      return undefined;
    }
  },
};
