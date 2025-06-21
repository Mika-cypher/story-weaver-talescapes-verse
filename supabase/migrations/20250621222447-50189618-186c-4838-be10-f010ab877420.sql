
-- Add foreign key relationships to link content_comments and reviews to profiles
ALTER TABLE public.content_comments 
ADD CONSTRAINT fk_content_comments_user_profile 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT fk_reviews_user_profile 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
