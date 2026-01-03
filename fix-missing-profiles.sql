-- Fix for missing profiles issue
-- This ensures profiles exist for all authenticated users

-- First, create profiles for any users that don't have them
INSERT INTO profiles (id, email, username, created_at, updated_at)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)),
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the trigger exists and is correct
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.created_at,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to ensure it fires
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Check if there are any orphaned questions (with author_id not in profiles)
-- This will show you if there are any problematic records
SELECT
  q.id as question_id,
  q.author_id,
  q.author_name,
  q.title
FROM questions q
LEFT JOIN profiles p ON q.author_id = p.id
WHERE q.author_id IS NOT NULL
  AND p.id IS NULL
ORDER BY q.created_at DESC;
