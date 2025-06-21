
-- Create reviews table for user reviews of cultural content
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id TEXT NOT NULL, -- Can reference stories, songs, dialects by ID
  content_type TEXT NOT NULL CHECK (content_type IN ('story', 'song', 'dialect')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id, content_type)
);

-- Create reading/listening lists table
CREATE TABLE public.user_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('story', 'song', 'dialect')),
  list_type TEXT NOT NULL CHECK (list_type IN ('want_to_read', 'currently_reading', 'read', 'want_to_listen', 'currently_listening', 'listened')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id, content_type)
);

-- Create comments table for community discussions
CREATE TABLE public.content_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('story', 'song', 'dialect')),
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.content_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for user lists
CREATE POLICY "Users can view their own lists" ON public.user_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own list items" ON public.user_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own list items" ON public.user_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own list items" ON public.user_lists FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for comments
CREATE POLICY "Anyone can view comments" ON public.content_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.content_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.content_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.content_comments FOR DELETE USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_comments_updated_at BEFORE UPDATE ON public.content_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indices for better performance
CREATE INDEX idx_reviews_content ON public.reviews(content_id, content_type);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_user_lists_user ON public.user_lists(user_id);
CREATE INDEX idx_user_lists_content ON public.user_lists(content_id, content_type);
CREATE INDEX idx_comments_content ON public.content_comments(content_id, content_type);
CREATE INDEX idx_comments_parent ON public.content_comments(parent_comment_id);
