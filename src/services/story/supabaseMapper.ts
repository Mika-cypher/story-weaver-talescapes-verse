
import { Story } from "@/types/story";

// Helper function to convert Supabase story data to our Story type
export function mapSupabaseStory(data: any): Story {
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

export function mapStoryToSupabase(story: Story, userId: string) {
  return {
    id: story.id,
    title: story.title,
    description: story.description,
    cover_image_url: story.coverImage,
    author_id: userId,
    status: story.status,
    featured: story.featured,
    start_scene_id: story.startSceneId,
  };
}
