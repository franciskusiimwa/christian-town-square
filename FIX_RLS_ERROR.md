# Fix for RLS Profile Error

## The Problem
You're seeing the error: `"new row violates row-level security policy for table 'profiles'"`

This happens because the original RLS policy was blocking profile creation during signup.

## The Solution
I've updated the system to use a **database trigger** that automatically creates user profiles when they sign up. This is the recommended Supabase pattern.

## Steps to Fix

### Option 1: Reset Everything (Recommended if you have no data)

1. **Go to Supabase Dashboard** → **SQL Editor**

2. **Delete existing tables:**
   ```sql
   DROP TABLE IF EXISTS answers CASCADE;
   DROP TABLE IF EXISTS questions CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
   ```

3. **Run the updated setup script:**
   - Copy ALL the contents from `supabase-setup.sql`
   - Paste and run in SQL Editor

4. **Try signing up again**
   - Go to your app
   - Sign up with a new account
   - Profile will be created automatically!

### Option 2: Update Without Deleting Data

If you already have data you want to keep:

1. **Go to Supabase Dashboard** → **SQL Editor**

2. **Update RLS policies:**
   ```sql
   -- Drop old insert policy
   DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
   ```

3. **Add the trigger function:**
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   DECLARE
     admin_email TEXT;
   BEGIN
     admin_email := 'franciskusiimwa@gmail.com';

     INSERT INTO public.profiles (id, email, username, is_admin)
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
       NEW.email = admin_email
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

4. **Clean up failed signups:**
   - Go to **Authentication** → **Users** in Supabase Dashboard
   - Delete any test users that failed to create profiles

5. **Try signing up again**

## What Changed

### Before (❌ Caused Error):
- Frontend tried to create profile after signup
- RLS policy blocked it

### After (✅ Works):
- Database trigger automatically creates profile
- Happens at database level with elevated privileges
- No RLS issues

## Testing

1. Sign up with a new account
2. Check **Table Editor** → **profiles** - your profile should be there
3. If you used `franciskusiimwa@gmail.com`, you'll be an admin automatically
4. Check the footer - you should see the "Admin" link

## About the Email Rate Limit

The first error you saw: `"over_email_send_rate_limit"`

This is Supabase's rate limiting on confirmation emails. Solutions:

1. **Wait 60 seconds** between signup attempts
2. **Disable email confirmation** (for development):
   - Go to **Authentication** → **Providers** → **Email**
   - Turn off "Confirm email"
3. **Use different emails** for each test

## Still Having Issues?

If you still see errors:

1. Check browser console for detailed error messages
2. Go to Supabase Dashboard → **Logs** to see server-side errors
3. Make sure your `.env` file has the correct Supabase URL and key
4. Restart your dev server after any `.env` changes

## Verify Everything Works

```bash
# Restart dev server
npm run dev
```

Then test:
- ✅ Sign up with new account
- ✅ Sign in
- ✅ Post a question
- ✅ Post an answer
- ✅ Access admin dashboard (if you're admin)
