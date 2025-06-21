
import { User, Session } from '@supabase/supabase-js';

export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio?: string;
  role: UserRole;
}

export interface ExtendedUser extends User {
  username?: string;
}

export interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  savedStories: string[];
  saveStory: (storyId: string) => Promise<void>;
  unsaveStory: (storyId: string) => Promise<void>;
  isStorySaved: (storyId: string) => boolean;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;
  likeContent: (contentId: string, contentType: string) => void;
  unlikeContent: (contentId: string, contentType: string) => void;
  isContentLiked: (contentId: string) => boolean;
  getUserSubmissions: () => Promise<any[]>;
  submitContent: (content: any) => Promise<boolean>;
}
