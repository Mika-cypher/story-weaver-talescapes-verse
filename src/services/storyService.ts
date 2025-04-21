import { Story } from "@/types/story";
import { supabase } from "@/integrations/supabase/client";

// In a real app, this would interact with an API or database
// Now: Use Supabase for authenticated users, else fallback to localStorage

const STORIES_KEY = "interactive_stories";

function isSupabaseAuthenticated() {
  // Check Supabase auth user (null if not authenticated)
  const user = supabase.auth.getUser();
  return !!user;
}

export const storyService = {
  // Get stories (published for now), Supabase or localStorage depending on session
  getStories: async (): Promise<Story[]> => {
    // If authenticated, fetch user stories from Supabase
    // Otherwise, use localStorage as fallback
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Fetch all stories, including drafts, for the logged-in user
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id, title, description, cover_image_url as coverImage, author_id as author, created_at as createdAt, updated_at as updatedAt, status, featured, start_scene_id as startSceneId
        `)
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Supabase story fetch error:", error);
        return [];
      }
      // Fetch scenes for each story (optional: batch or as needed on demand)
      return data as unknown as Story[];
    } else {
      // Fallback: localStorage
      const stories = localStorage.getItem(STORIES_KEY);
      return stories ? JSON.parse(stories) : [];
    }
  },

  getStoryById: async (id: string): Promise<Story | undefined> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Fetch single story
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id, title, description, cover_image_url as coverImage, author_id as author, created_at as createdAt, updated_at as updatedAt, status, featured, start_scene_id as startSceneId
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
      const { data: scenesData } = await supabase
        .from("scenes")
        .select(`
          id, title, content, image_url as image, audio_url as audio, is_ending as isEnding, 
          choices (
            id, text, next_scene_id as nextSceneId
          )
        `)
        .eq("story_id", id)
        .order("created_at", { ascending: true });

      const story: Story = {
        ...data,
        scenes: scenesData || [],
      };
      return story;
    } else {
      const stories = storyService.getStories();
      if (stories instanceof Promise) {
        return stories.then(list => list.find(story => story.id === id));
      }
      return stories.find(story => story.id === id);
    }
  },

  getPublishedStories: async (): Promise<Story[]> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Published only
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id, title, description, cover_image_url as coverImage, author_id as author, created_at as createdAt, updated_at as updatedAt, status, featured, start_scene_id as startSceneId
        `)
        .eq("status", "published")
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Supabase published fetch error:", error);
        return [];
      }
      return data as unknown as Story[];
    } else {
      const stories = storyService.getStories();
      if (stories instanceof Promise) return stories.then(list => list.filter(story => story.status === "published"));
      return stories.filter(story => story.status === "published");
    }
  },

  getFeaturedStories: async (): Promise<Story[]> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          id, title, description, cover_image_url as coverImage, author_id as author, created_at as createdAt, updated_at as updatedAt, status, featured, start_scene_id as startSceneId
        `)
        .eq("status", "published")
        .eq("featured", true)
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Supabase featured fetch error:", error);
        return [];
      }
      return data as unknown as Story[];
    } else {
      const stories = storyService.getStories();
      if (stories instanceof Promise) return stories.then(list => list.filter(story => story.status === "published" && story.featured));
      return stories.filter(story => story.status === "published" && story.featured);
    }
  },

  saveStory: async (story: Story): Promise<Story> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Upsert story in Supabase
      const { data, error } = await supabase
        .from("stories")
        .upsert({
          id: story.id,
          title: story.title,
          description: story.description,
          cover_image_url: story.coverImage,
          author_id: session.data.session.user.id,
          status: story.status,
          featured: story.featured,
          start_scene_id: story.startSceneId,
        })
        .select("*")
        .maybeSingle();
      if (error) {
        console.error("Supabase story upsert error:", error);
        throw error;
      }
      // TODO: Upsert scenes and choices
      // (For now, this is enough for MVP. You may extend this to include scenes in Supabase per story.)
      return { ...story };
    } else {
      const stories = storyService.getStories();
      const existingIndex = stories.findIndex(s => s.id === story.id);

      if (existingIndex >= 0) {
        stories[existingIndex] = {
          ...story,
          updatedAt: new Date().toISOString(),
        };
      } else {
        stories.push({
          ...story,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
      return story;
    }
  },

  deleteStory: async (id: string): Promise<void> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase story delete error:", error);
      }
    } else {
      const stories = storyService.getStories();
      const filteredStories = stories.filter(story => story.id !== id);
      localStorage.setItem(STORIES_KEY, JSON.stringify(filteredStories));
    }
  },

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
      return data as Story;
    } else {
      const stories = storyService.getStories();
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
      return data as Story;
    } else {
      const stories = storyService.getStories();
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
