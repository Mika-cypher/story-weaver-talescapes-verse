
export interface StoryServiceConfig {
  useSupabase: boolean;
  userId?: string;
}

export interface StoryQuery {
  status?: "draft" | "published";
  featured?: boolean;
  authorId?: string;
}
