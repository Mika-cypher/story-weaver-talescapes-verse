import { Story } from "@/types/story";
import { supabase } from "@/integrations/supabase/client";

// In a real app, this would interact with an API or database
// Now: Use Supabase for authenticated users, else fallback to localStorage

const STORIES_KEY = "interactive_stories";

// Helper function to convert Supabase story data to our Story type
function mapSupabaseStory(data: any): Story {
  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    coverImage: data.cover_image_url,
    author: data.author_id, // This will be replaced with actual author name in a real app
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    status: data.status,
    featured: data.featured,
    startSceneId: data.start_scene_id,
    scenes: [], // Scenes will be populated separately when needed
  };
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
          id, title, description, cover_image_url, author_id, created_at, updated_at, status, featured, start_scene_id
        `)
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Supabase story fetch error:", error);
        return [];
      }
      // Map to our Story type
      return data.map(item => mapSupabaseStory(item));
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

      // Map to our Story type with scenes
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
      // Fallback to localStorage
      const stories = await storyService.getStories();
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
      const stories = await storyService.getStories();
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
      const stories = await storyService.getStories();
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
      
      // Save scenes if provided
      if (story.scenes && story.scenes.length > 0) {
        // First, fetch existing scenes to determine what needs to be updated/created/deleted
        const { data: existingScenes } = await supabase
          .from("scenes")
          .select("id")
          .eq("story_id", story.id);
        
        const existingSceneIds = new Set((existingScenes || []).map((s: any) => s.id));
        const newSceneIds = new Set(story.scenes.map(s => s.id));
        
        // Scenes to delete
        const scenesToDelete = Array.from(existingSceneIds)
          .filter(id => !newSceneIds.has(id as string));
        
        if (scenesToDelete.length > 0) {
          await supabase.from("scenes").delete().in("id", scenesToDelete);
        }
        
        // Upsert scenes
        for (const scene of story.scenes) {
          const { error: sceneError } = await supabase
            .from("scenes")
            .upsert({
              id: scene.id,
              story_id: story.id,
              title: scene.title,
              content: scene.content,
              image_url: scene.image,
              audio_url: scene.audio,
              is_ending: scene.isEnding || false,
            });
          
          if (sceneError) {
            console.error("Error saving scene:", sceneError);
            continue;
          }
          
          // Delete existing choices for this scene
          await supabase
            .from("choices")
            .delete()
            .eq("scene_id", scene.id);
          
          // Insert new choices
          if (scene.choices && scene.choices.length > 0) {
            const choicesData = scene.choices.map(choice => ({
              id: choice.id,
              scene_id: scene.id,
              text: choice.text,
              next_scene_id: choice.nextSceneId,
            }));
            
            const { error: choicesError } = await supabase
              .from("choices")
              .insert(choicesData);
            
            if (choicesError) {
              console.error("Error saving choices:", choicesError);
            }
          }
        }
      }
      
      return story;
    } else {
      // Fallback to localStorage
      const stories = await storyService.getStories();
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
      const stories = await storyService.getStories();
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
      return mapSupabaseStory(data);
    } else {
      const stories = await storyService.getStories();
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
      const stories = await storyService.getStories();
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
