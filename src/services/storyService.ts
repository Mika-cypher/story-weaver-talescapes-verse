
import { storyReader } from "./story/storyReader";
import { storyWriter } from "./story/storyWriter";
import { storyUpdater } from "./story/storyUpdater";

// Re-export all story service functions from the refactored modules
export const storyService = {
  // Reader operations
  getStories: storyReader.getStories,
  getStoryById: storyReader.getStoryById,
  getPublishedStories: storyReader.getPublishedStories,
  getFeaturedStories: storyReader.getFeaturedStories,

  // Writer operations
  saveStory: storyWriter.saveStory,
  deleteStory: storyWriter.deleteStory,

  // Update operations
  updateStoryStatus: storyUpdater.updateStoryStatus,
  updateStoryFeatured: storyUpdater.updateStoryFeatured,
};
