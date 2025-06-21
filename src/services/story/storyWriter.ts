
import { Story } from "@/types/story";
import { supabase } from "@/integrations/supabase/client";
import { mapStoryToSupabase } from "./supabaseMapper";
import { storyReader } from "./storyReader";

const STORIES_KEY = "interactive_stories";

export const storyWriter = {
  saveStory: async (story: Story): Promise<Story> => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const { data, error } = await supabase
        .from("stories")
        .upsert(mapStoryToSupabase(story, session.data.session.user.id))
        .select("*")
        .maybeSingle();
      if (error) {
        console.error("Supabase story upsert error:", error);
        throw error;
      }
      
      // Save scenes if provided
      if (story.scenes && story.scenes.length > 0) {
        const { data: existingScenes } = await supabase
          .from("scenes")
          .select("id")
          .eq("story_id", story.id);
        
        const existingSceneIds = new Set((existingScenes || []).map((s: any) => s.id));
        const newSceneIds = new Set(story.scenes.map(s => s.id));
        
        const scenesToDelete = Array.from(existingSceneIds)
          .filter(id => !newSceneIds.has(id as string));
        
        if (scenesToDelete.length > 0) {
          await supabase.from("scenes").delete().in("id", scenesToDelete);
        }
        
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
          
          await supabase
            .from("choices")
            .delete()
            .eq("scene_id", scene.id);
          
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
      const stories = await storyReader.getStories();
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
      const stories = await storyReader.getStories();
      const filteredStories = stories.filter(story => story.id !== id);
      localStorage.setItem(STORIES_KEY, JSON.stringify(filteredStories));
    }
  },
};
