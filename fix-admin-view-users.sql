-- Fix Admin Access to View All Users
-- This allows admins to view all profiles in the admin dashboard

-- Step 1: Drop existing select policy on profiles if it exists
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_select_all_policy" ON profiles;

-- Step 2: Create new select policy that allows:
-- - Users to view their own profile
-- - Admins to view all profiles
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- Step 3: Drop and recreate update policy to allow admins to update any profile
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_admin_policy" ON profiles;

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- Verify the policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
