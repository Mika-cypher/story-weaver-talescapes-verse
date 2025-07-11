
export interface StoryChoice {
  id: string;
  text: string;
  nextSceneId: string;
}

export interface StoryScene {
  id: string;
  title: string;
  content: string;
  image?: string;
  audio?: string;
  choices: StoryChoice[];
  isEnding?: boolean;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
  featured: boolean;
  startSceneId: string;
  scenes: StoryScene[];
  category?: string;
}
