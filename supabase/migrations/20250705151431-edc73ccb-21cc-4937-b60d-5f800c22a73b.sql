-- Phase 2: Database Cleanup and Cultural Categories

-- First, let's clean up the sample stories (keeping only a few quality examples)
DELETE FROM choices WHERE scene_id IN (
  SELECT s.id FROM scenes s 
  JOIN stories st ON s.story_id = st.id 
  WHERE st.title LIKE '%Sample%' OR st.title LIKE '%Test%' OR st.title LIKE '%Example%'
);

DELETE FROM scenes WHERE story_id IN (
  SELECT id FROM stories 
  WHERE title LIKE '%Sample%' OR title LIKE '%Test%' OR title LIKE '%Example%'
);

DELETE FROM stories WHERE title LIKE '%Sample%' OR title LIKE '%Test%' OR title LIKE '%Example%';

-- Add cultural categories table for better content organization
CREATE TABLE public.cultural_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.cultural_categories(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert African cultural categories
INSERT INTO public.cultural_categories (name, description) VALUES
('West African Folktales', 'Traditional stories from West African cultures including Yoruba, Akan, and Mandinka traditions'),
('East African Legends', 'Mythical stories and legends from East African communities'),
('Southern African Tales', 'Traditional narratives from Southern African cultures including Zulu, Xhosa, and Shona'),
('Contemporary African Fiction', 'Modern stories by African authors exploring contemporary themes'),
('Oral Traditions', 'Stories passed down through generations via oral storytelling'),
('Creation Myths', 'Traditional creation stories from various African cultures'),
('Trickster Tales', 'Stories featuring Anansi, Hare, and other trickster characters'),
('Historical Narratives', 'Stories based on historical events and figures from African history');

-- Add category relationship to stories
ALTER TABLE public.stories ADD COLUMN category_id UUID REFERENCES public.cultural_categories(id);

-- Add story progression tracking
CREATE TABLE public.user_story_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  current_scene_id UUID REFERENCES public.scenes(id),
  scenes_visited UUID[] DEFAULT ARRAY[]::UUID[],
  choices_made JSONB DEFAULT '[]'::jsonb,
  completion_percentage INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- Enable RLS on new tables
ALTER TABLE public.cultural_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_story_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for cultural categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
ON public.cultural_categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage categories" 
ON public.cultural_categories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- RLS policies for user story progress
CREATE POLICY "Users can view their own progress" 
ON public.user_story_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.user_story_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_story_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update progress timestamps
CREATE TRIGGER update_cultural_categories_updated_at
BEFORE UPDATE ON public.cultural_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_story_progress_updated_at
BEFORE UPDATE ON public.user_story_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();