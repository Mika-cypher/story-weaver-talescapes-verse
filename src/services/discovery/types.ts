
export interface Review {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'story' | 'song' | 'dialect';
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface UserList {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'story' | 'song' | 'dialect';
  list_type: 'want_to_read' | 'currently_reading' | 'read' | 'want_to_listen' | 'currently_listening' | 'listened';
  created_at: string;
}

export interface ContentComment {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'story' | 'song' | 'dialect';
  comment_text: string;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}
