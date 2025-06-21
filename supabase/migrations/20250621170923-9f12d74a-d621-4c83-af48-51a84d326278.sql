
-- First, let's make sure the profiles table has a role column
-- Check if role column exists and add it if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Create an admin user profile (you'll need to sign up with this email first through the normal signup process)
-- Replace 'admin@gmail.com' with your preferred admin email
INSERT INTO public.profiles (id, username, display_name, role)
SELECT 
    id,
    'admin',
    'Administrator',
    'admin'
FROM auth.users 
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- If no user exists with that email, we'll create a placeholder that will be updated when you sign up
-- Note: You'll need to actually sign up with admin@gmail.com through the normal signup flow first
