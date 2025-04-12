
import { Story } from "@/types/story";

// In a real app, this would interact with an API or database
// For now, we'll use localStorage for persistence

const STORIES_KEY = "interactive_stories";

export const storyService = {
  getStories: (): Story[] => {
    const stories = localStorage.getItem(STORIES_KEY);
    return stories ? JSON.parse(stories) : [];
  },

  getStoryById: (id: string): Story | undefined => {
    const stories = storyService.getStories();
    return stories.find(story => story.id === id);
  },

  getPublishedStories: (): Story[] => {
    const stories = storyService.getStories();
    return stories.filter(story => story.status === "published");
  },

  getFeaturedStories: (): Story[] => {
    const stories = storyService.getStories();
    return stories.filter(story => story.status === "published" && story.featured);
  },

  saveStory: (story: Story): Story => {
    const stories = storyService.getStories();
    const existingIndex = stories.findIndex(s => s.id === story.id);
    
    if (existingIndex >= 0) {
      // Update existing story
      stories[existingIndex] = {
        ...story,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new story
      stories.push({
        ...story,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
    return story;
  },

  deleteStory: (id: string): void => {
    const stories = storyService.getStories();
    const filteredStories = stories.filter(story => story.id !== id);
    localStorage.setItem(STORIES_KEY, JSON.stringify(filteredStories));
  },

  updateStoryStatus: (id: string, status: "draft" | "published"): Story | undefined => {
    const stories = storyService.getStories();
    const storyIndex = stories.findIndex(story => story.id === id);
    
    if (storyIndex >= 0) {
      stories[storyIndex].status = status;
      stories[storyIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
      return stories[storyIndex];
    }
    
    return undefined;
  },

  updateStoryFeatured: (id: string, featured: boolean): Story | undefined => {
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
};
