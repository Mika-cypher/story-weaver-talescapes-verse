
-- Create enhanced media table for better file management
CREATE TABLE public.creator_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video', 'document')),
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  tags TEXT[],
  category TEXT,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  license_type TEXT DEFAULT 'all_rights_reserved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolios table for organized collections
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  portfolio_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio items junction table
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  media_id UUID REFERENCES public.creator_media(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create commissions table for artists
CREATE TABLE public.commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  deadline DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create engagement metrics table with proper UUID type for content_id
CREATE TABLE public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('story', 'media', 'portfolio')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'like', 'share', 'download', 'commission_request')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for creator media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'creator-media',
  'creator-media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'video/mp4', 'video/webm', 'application/pdf']
);

-- Enable RLS on all new tables
ALTER TABLE public.creator_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for creator_media
CREATE POLICY "Users can view public media or their own media"
  ON public.creator_media FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own media"
  ON public.creator_media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media"
  ON public.creator_media FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
  ON public.creator_media FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for portfolios
CREATE POLICY "Users can view public portfolios or their own portfolios"
  ON public.portfolios FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for portfolio_items
CREATE POLICY "Users can view portfolio items if they can view the portfolio"
  ON public.portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE p.id = portfolio_id
      AND (p.is_public = true OR p.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own portfolio items"
  ON public.portfolio_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE p.id = portfolio_id AND p.user_id = auth.uid()
    )
  );

-- RLS policies for commissions
CREATE POLICY "Users can view commissions they're involved in"
  ON public.commissions FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = artist_id);

CREATE POLICY "Clients can create commission requests"
  ON public.commissions FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Involved users can update commissions"
  ON public.commissions FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = artist_id);

-- RLS policies for content_analytics (fixed with proper UUID comparisons)
CREATE POLICY "Users can view analytics for their own content"
  ON public.content_analytics FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.creator_media cm
      WHERE cm.id = content_id AND cm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE p.id = content_id AND p.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.stories s
      WHERE s.id = content_id AND s.author_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create analytics events"
  ON public.content_analytics FOR INSERT
  WITH CHECK (true);

-- Add creator_type to profiles table for specialization
ALTER TABLE public.profiles ADD COLUMN creator_type TEXT[];
ALTER TABLE public.profiles ADD COLUMN bio_long TEXT;
ALTER TABLE public.profiles ADD COLUMN website_url TEXT;
ALTER TABLE public.profiles ADD COLUMN commission_status TEXT DEFAULT 'closed' CHECK (commission_status IN ('open', 'limited', 'closed'));
ALTER TABLE public.profiles ADD COLUMN hourly_rate INTEGER;

-- Storage policies for creator-media bucket
CREATE POLICY "Users can upload their own media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'creator-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all public media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'creator-media');

CREATE POLICY "Users can update their own media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'creator-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'creator-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_creator_media_updated_at
  BEFORE UPDATE ON public.creator_media
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
